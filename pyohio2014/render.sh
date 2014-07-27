pandoc --smart --css slidy.css -s --standalone -f markdown -t slidy rtl_fm_python2.md -o present.html
dot -Tpng ./iteration.dot > iteration.png
