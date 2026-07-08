#!/bin/bash
OUTPUT="lovable_source.txt"
rm -f "$OUTPUT"
touch "$OUTPUT"

echo "Tổng hợp source code BaoCaoThiTruong cho Lovable" > "$OUTPUT"
echo "=================================================" >> "$OUTPUT"

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" -o -name "*.html" -o -name "package.json" \) -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" | sort | while read -r file; do
    echo -e "\n\n--- FILE: ${file#./} ---\n" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
done

echo "Done."
