# Python Environment Setup with uv

## Initial Setup (First Time)

```bash
# 1. Create virtual environment
uv venv

# 2. Activate virtual environment  
source .venv/bin/activate

# 3. Install core dependencies
uv pip install numpy
uv pip install torch --index-url https://download.pytorch.org/whl/cpu
uv pip install sentence-transformers
uv pip install pandas

# 4. Verify installation
python -c "import sentence_transformers; print('✅ Dependencies installed successfully')"
```

## Daily Development Workflow

```bash
# Activate environment (run this each time you start working)
source .venv/bin/activate

# Verify you're in the right environment
which python  # Should show .venv/bin/python

# Run embedding generation
python scripts/generate_embeddings.py

# Run similarity matrix building
python scripts/build_similarity_matrix.js  # This is Node.js, no venv needed
```

## Troubleshooting

### If packages are missing:
```bash
source .venv/bin/activate
uv pip install sentence-transformers torch numpy pandas
```

### If virtual environment is corrupted:
```bash
rm -rf .venv
uv venv
source .venv/bin/activate
uv pip install sentence-transformers torch numpy pandas
```

### Check installed packages:
```bash
source .venv/bin/activate
uv pip list
```

## For Future Sessions

**Always run first**:
```bash
source .venv/bin/activate
```

**Then you can run Python scripts**:
```bash
python scripts/generate_embeddings.py
```

## Dependencies Installed
- `sentence-transformers>=2.2.2` - For generating verse embeddings
- `torch>=1.9.0` - PyTorch backend for transformers
- `numpy>=1.21.0` - Numerical computing
- `pandas>=1.3.0` - Data manipulation (optional)

This setup ensures reproducible Python environments across different machines and sessions.