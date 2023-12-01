# Build the Docker container
build:
	docker build -t djaisp-frontend .

# Run the Docker container and enter a bash shell
run:
	docker run -it --rm -p 9090:3000 djaisp-frontend

# Shortcut to build, run, install, and start the app in development mode
start: build run

# Restart the Docker container without rebuilding (not working rn)
rerun:
	docker start -i djaisp-backend