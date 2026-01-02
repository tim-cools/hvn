PYTHON=/opt/push3/XPython3Exe
PYTHON_LIB=/opt/push3/third-party/python3/dist/cpython/Lib:/data/Music/Ableton/Sets/hvn-ableton-project/server/venv/lib/python3.7/site-packages

export PYTHONPATH=$PYTHON_LIB
export PYTHONHOME=$PYTHON_LIB

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )


$PYTHON main.py