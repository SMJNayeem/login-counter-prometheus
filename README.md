
## Request Flow

Incoming Requests: All incoming HTTP requests are first received by the NGINX load balancer.  
Load Balancing: NGINX distributes the requests across the running Express server instances using a round-robin algorithm.  
Express Server Request Handling: Each Express server instance handles the incoming request based on the defined routes (e.g., /login, /scale, /logout).  
Metrics Collection: For each incoming request, the Express server increments the corresponding Prometheus counter (e.g., http_requests_total or scale_requests_total).  
Prometheus Scraping: Prometheus periodically scrapes the /metrics endpoint of each Express server instance to collect the metrics.  
Alert Evaluation: Prometheus evaluates the configured alert rules against the collected metrics (e.g., HighRequestCount and HighScaleRequestCount).  
Alerting: If an alert condition is met, Prometheus sends the alert to the AlertManager.  
Alert Forwarding: The AlertManager forwards the received alerts to the configured receivers (scaler and alert-service).  
Scaling and Logging: Based on the alert conditions, the scaler service launches or terminates Express server containers, and the alert-service logs the alert details.

## Service Connections and Interactions

NGINX Load Balancer: NGINX is configured to forward requests to the running Express server instances using the upstream servers directive in the nginx.conf file.  
Express Servers: The Express servers expose a /metrics endpoint, which Prometheus scrapes to collect metrics. The servers also handle various routes like /login, /scale, and /logout.  
Prometheus: Prometheus is configured to scrape metrics from the Express servers using the file_sd_configs feature, which reads target information from JSON files in the targets directory. The update_targets.sh script updates these target files based on the running Express server containers.  
AlertManager: Prometheus is configured to send alerts to the AlertManager using the alertmanagers section in the prometheus.yml file.  
Scaler Service: The scaler service listens for alerts from the AlertManager on the /alert endpoint. It uses the node-docker-api library to interact with the Docker API and launch or terminate Express server containers based on the alert conditions.  
Alert Service: The alert-service also listens for alerts from the AlertManager on the /alert endpoint and logs the alert details to the console.

## Exploring the System Step by Step

Start the system using docker-compose up --build.  
Initially, three Express server containers will be launched, and Prometheus will automatically discover and monitor them.  
Send HTTP requests to the NGINX load balancer (e.g., http://localhost/login, http://localhost/scale).  
Observe the request logs in the Express server containers.  
Access the Prometheus web UI at http://localhost:9090 to explore the collected metrics and alert rules.  
To trigger the HighRequestCount alert, send a large number of requests (e.g., using a tool like hey or ab) to the NGINX load balancer within a short period.  
Observe that the scaler service launches a new Express server container, and Prometheus automatically starts monitoring it.  
To trigger the HighScaleRequestCount alert, send a large number of requests to the /scale endpoint within a short period.  
Observe that the scaler service terminates one of the Express server containers, and Prometheus automatically stops monitoring it.  
Check the logs of the alert-service container to see the alert details.