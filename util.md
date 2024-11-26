
## List all files in a directory

```bash

rsync -av --exclude-from='.gitignore' ./ ./filtered/ && cd filtered && tree > ../tree.txt && cd .. && cat tree.txt

```

## List all files in a directory with content base64

```bash

```
