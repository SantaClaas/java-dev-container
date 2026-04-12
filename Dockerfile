# Stages can be targeted individually by name e.g. docker build --target final
FROM maven:eclipse-temurin AS build
WORKDIR /app

# Set up dependencies for caching first
COPY server/pom.xml .
COPY server/mvnw .
COPY server/.mvn .mvn
RUN chmod +x mvnw && ./mvnw -DskipTests dependency:go-offline

# Copy source and build
COPY server/src src
RUN ./mvnw -DskipTests clean package


FROM eclipse-temurin:21-jre AS final
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]