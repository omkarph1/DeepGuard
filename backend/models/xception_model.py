import torch
import torch.nn as nn
import timm

class XceptionDeepfake(nn.Module):
    def __init__(self, num_classes=2, dropout=0.5):
        super().__init__()
        # 92.35% accuracy backbone
        self.backbone = timm.create_model('legacy_xception', pretrained=False, num_classes=0, drop_rate=dropout)
        
        # Feature dimension is 2048
        # Custom classification head
        self.head = nn.Sequential(
            nn.LayerNorm(2048),
            nn.Dropout(dropout),
            nn.Linear(2048, 512),
            nn.BatchNorm1d(512),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):
        feats = self.backbone(x)
        return self.head(feats)
