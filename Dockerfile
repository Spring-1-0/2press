# Use Maven to build the application
FROM maven:3.8.5-openjdk-17 AS build

# Set working directory
WORKDIR /app

# Copy the Maven project files and build the application
COPY . .

# Build the application with Maven (skipping tests)
RUN mvn clean package -DskipTests

# Use OpenJDK for the final image
FROM openjdk:17.0.1-jdk-slim

# Set the working directory in the final image
WORKDIR /app

# Copy the built JAR file from the build stage to the final image
COPY --from=build target/printFlow-0.0.1-SNAPSHOT.jar printFlow.jar

# Expose the port the application runs on
EXPOSE 8080

# Define the command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "printFlow.jar"]
