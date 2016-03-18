#! /usr/bin/env python3

# Generate a Qt Resource file from the contents of a list of directories
# qrc.py <dir1> <dir2> ...

import os, os.path
import sys

file_list = []

dirname = sys.argv[1]

for root, dirs, files in os.walk(dirname):
	file_list += [os.path.relpath(os.path.join(root, filename), dirname) for filename in files]

file_list.sort()

contents = '<!DOCTYPE RCC>\n<RCC version="1.0">\n\n<qresource>\n'

for filename in file_list:
	contents += '\t<file>' + filename + '</file>\n'

contents += '</qresource>\n\n</RCC>\n'

print(contents)
