# File: proxy/Dockerfile
FROM envoyproxy/envoy:v1.22.0
# Remove any existing file
RUN rm -f /etc/envoy/envoy.yaml
# Copy our config
COPY envoy.yaml /etc/envoy/envoy.yaml
CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml

# Uncomment if in EC2 AWS:
# FROM envoyproxy/envoy:v1.26-latest
# COPY envoy.yaml /etc/envoy/envoy.yaml
# CMD ["/usr/local/bin/envoy", "-c", "/etc/envoy/envoy.yaml"]