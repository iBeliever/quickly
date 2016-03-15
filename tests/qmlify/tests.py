import os.path
import os
import subprocess
import sys
from difflib import Differ

tests_dir = os.path.dirname(__file__)
qmlify = os.path.abspath(os.path.join(tests_dir, '..', '..', 'qmlify'))

def compare(text1, text2, message):
    if text1 == text2:
        return

    lines1 = text1.splitlines(1)
    lines2 = text2.splitlines(1)

    d = Differ()
    result = list(d.compare(lines1, lines2))

    print(message)
    sys.stdout.writelines(result)
    sys.exit(1)

def run_test(name):
    source_filename = os.path.join(tests_dir, name, 'actual.js')
    expected_filename = os.path.join(tests_dir, name, 'expected.js')
    output_dirname = os.path.join(tests_dir, name, 'build')
    output_filename = os.path.join(output_dirname, 'actual.js')

    args = [qmlify, '--no-polyfills']
    if 'es5' in name:
        args.append('--no-babel')
    args.append(source_filename)
    args.append(output_dirname)

    subprocess.run(args, check=True)

    with open(output_filename) as f:
        output = f.read()

    with open(expected_filename) as f:
        expected = f.read()

    compare(expected, output, 'Test \'{}\' failed: '.format(name))

for filename in os.listdir(tests_dir):
    if os.path.isdir(os.path.join(tests_dir, filename)):
        run_test(filename)
