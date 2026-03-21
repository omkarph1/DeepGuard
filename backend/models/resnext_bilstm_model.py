import torch
import torch.nn as nn
from torchvision.models import resnext50_32x4d

class ResNeXtBiLSTM(nn.Module):
    def __init__(self, lstm_hidden=1024, lstm_layers=1, dropout=0.4, num_classes=2, bidirectional=True):
        super().__init__()
        # 94.00% accuracy backbone
        backbone = resnext50_32x4d(weights=None)
        
        # Split into named stages
        self.stem    = nn.Sequential(backbone.conv1, backbone.bn1, backbone.relu, backbone.maxpool)
        self.layer1  = backbone.layer1
        self.layer2  = backbone.layer2
        self.layer3  = backbone.layer3
        self.layer4  = backbone.layer4
        self.avgpool = backbone.avgpool
        self.feat_dim = 2048

        self.bidirectional = bidirectional
        self.lstm = nn.LSTM(
            input_size  = self.feat_dim,
            hidden_size = lstm_hidden,
            num_layers  = lstm_layers,
            batch_first = True,
            dropout     = dropout if lstm_layers > 1 else 0.0,
            bidirectional = bidirectional,
        )
        lstm_out_dim = lstm_hidden * (2 if bidirectional else 1)  # 1024*2 = 2048

        # Custom classification head
        self.head = nn.Sequential(
            nn.LayerNorm(lstm_out_dim),
            nn.Dropout(dropout),
            nn.Linear(lstm_out_dim, 512),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):
        # Accepts (B, C, H, W) from frame-level dataset — wraps as T=1 sequence
        if x.dim() == 4:
            x = x.unsqueeze(1)              # (B, C, H, W) → (B, 1, C, H, W)
        B, T, C, H, W = x.shape
        x = x.view(B * T, C, H, W)

        # Simple forward
        x = self.stem(x)
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
        feats = self.avgpool(x)

        # Reshape for LSTM
        feats    = feats.view(B, T, self.feat_dim)   # (B, T, 2048)
        lstm_out, _ = self.lstm(feats)               # (B, T, lstm_out_dim)
        last_hidden  = lstm_out[:, -1, :]            # (B, lstm_out_dim)
        
        return self.head(last_hidden)
