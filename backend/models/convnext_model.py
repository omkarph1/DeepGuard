import torch
import torch.nn as nn
import timm

class ConvNeXtV2Deepfake(nn.Module):
    def __init__(self, num_classes=2, dropout=0.4):
        super().__init__()
        # 96.01% accuracy backbone
        self.backbone = timm.create_model('convnextv2_base', pretrained=False, num_classes=0)
        
        # Custom classification head
        self.head = nn.Sequential(
            nn.LayerNorm(1024),
            nn.Dropout(dropout),
            nn.Linear(1024, 512),
            nn.GELU(),
            nn.Dropout(dropout / 2),
            nn.Linear(512, num_classes),
        )

    def forward(self, x):
        feats = self.backbone(x)
        return self.head(feats)
