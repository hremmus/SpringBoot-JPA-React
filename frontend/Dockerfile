# stage 1: 리액트 빌드를 위한 베이스 이미지로 Node.js를 사용
FROM node:18-alpine AS build

# 컨테이너 내의 작업 디렉토리 설정
WORKDIR /react

# package.json 복사
COPY package.json .

# 의존성 설치
RUN npm install

# 애플리케이션 소스를 복사하고 빌드
COPY . .
RUN npm run build

# stage 2: Nginx를 사용하여 정적 파일 서빙
FROM nginx:alpine

# 리액트 빌드 파일 복사
COPY --from=build /react/build /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY ./nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

# HTTP & HTTPS 포트 노출
EXPOSE 80
EXPOSE 443

# 애플리케이션 실행
CMD ["nginx", "-g", "daemon off;"]