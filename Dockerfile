FROM openjdk:21
EXPOSE 8080
ADD /backend/target/FitnessApp.jar /FitnessApp.jar
ENTRYPOINT ["java","-jar","/FitnessApp.jar"]
