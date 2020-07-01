if [ ! -f server/learn/model.pkl ]; then
    curl https://dube-hacking.s3.eu-central-1.amazonaws.com/mnist/model.pkl --output server/learn/model.pkl
fi

if [ ! -f server/learn/models/stage-2.pth ]; then
    curl https://dube-hacking.s3.eu-central-1.amazonaws.com/mnist/models/stage-2.pth --output server/learn/models/stage-2.pth
fi

if [ ! -f server/learn/models/stage-1.pth ]; then
    curl https://dube-hacking.s3.eu-central-1.amazonaws.com/mnist/models/stage-1.pth --output server/learn/models/stage-1.pth
fi
