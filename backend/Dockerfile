# 베이스 이미지로 oepnJDK 17을 사용
FROM openjdk:17-jdk-alpine

# 컨테이너 내의 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일을 컨테이너에 복사
COPY build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]