# DEVELOPER

install dev dependencies

    sudo npm install -g eslint live-server jest codeceptjs nightmare co --unsafe-perm=true
    
start server

    live-server ./src
    
run e2e tests

    codeceptjs run --steps
    
run unit tests

    jest
    
lint

    eslint . --fix