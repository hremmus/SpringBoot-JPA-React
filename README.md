# SpringBoot-JPA-React

이 애플리케이션은 Spring Boot를 사용해 REST API를 구축하고, JPA를 통해 데이터베이스와 상호작용하며, React UI를 통해 데이터를 시각적으로 표시하는 전체 집합으로 구성되어 있습니다.

## Introduction

국내에서 서핑을 즐기는 서퍼들을 위한 커뮤니티 플랫폼입니다. 실시간 파동 데이터 및 일기 예보를 포함한 5일간의 예측 자료를 인터랙티브 차트와 테이블에 제공합니다. 주요 지표로는 일출 및 일몰, 기온, 기상, 풍향과 풍속, 조수 상태, 파향과 파고 등이 있으며 일부 지역은 라이브 웹캠을 통해 파동 상태를 시각적으로 모니터링할 수 있어 서핑 스팟 선정에 도움이 됩니다. 또한 모임을 조직하거나 팁과 리뷰를 공유하는 공간이 있어 안전하고 즐거운 서핑을 경험할 수 있도록 지원합니다.

## Features

- AWS EC2의 ubuntu 환경에서 배포
- 데이터베이스로 AWS RDS를 사용: AWS에서 백업, 소프트웨어 패치, 모니터링과 같은 일상적인 데이터베이스 작업을 처리하기 때문에 개발자는 애플리케이션 구축에 집중할 수 있다.
- JWT(JSON Web Tokens)를 사용한 사용자 인증 및 권한 부여
- Cloud Storage로 AWS S3 버킷을 사용하여 업로드 되는 파일을 관리: 확장성, 고가용성, 데이터의 일관성(read-after-write)을 지니며, 액세스 관리가 쉽고 세분화 되어 있음
- React.js로 제작된 프론트엔드: 개발자가 수동으로 DOM(Document Object Model)을 조작하지 않고도 데이터 변화와 사용자의 상호 작용에 동적으로 대응할 수 있는 UI(User Interface)를 만들 수 있다.
- Open API를 이용하여 지도에 위치를 나타내거나, 필요한 예측 데이터를 수신 (Naver Maps, Windy Webcams, Windy Point Forecast, OpenWeatherMap Weather 5 Day / 3 Hour Forecast, KHOA 해양 예측 - 조위 & 조석)

## Architecture

![Architecture Diagram](https://github.com/user-attachments/assets/dfb70294-da84-4645-b59e-e76dfce26c3d)

## Usage

```bash
# Auth
POST    /api/auth/refreshtoken     # 액세스 토큰 재발급
POST    /api/auth/signin           # 로그인
GET     /api/auth/signout          # 로그아웃
POST    /api/auth/signup           # 회원가입

# Category
GET     /api/categories            # 모든 카테고리 조회
POST    /api/categories            # 카테고리 생성
DELETE  /api/categories/{id}       # 카테고리 삭제

# Comment
GET     /api/comments              # 해당 게시글의 모든 댓글 조회
POST    /api/comments              # 댓글 생성
DELETE  /api/comments/{id}         # 댓글 삭제
PATCH   /api/comments/{id}         # 댓글 수정

# Location
GET     /api/location              # 지역 목록 조회 (from CSV)

# Post
GET     /api/posts                 # 게시글 목록 조회
POST    /api/posts                 # 게시글 생성
GET     /api/posts/{id}            # 게시글 조회
PUT     /api/posts/{id}            # 게시글 수정
DELETE  /api/posts/{id}            # 게시글 삭제

# User
PUT     /api/user                  # 회원 정보 변경
GET     /api/user/{id}             # 회원 정보 조회
DELETE  /api/user/{id}             # 회원 삭제
POST    /api/user/checkpassword    # 회원 정보 변경 전 패스워드 확인
GET     /api/users                 # 회원 목록 검색
```

**Example:**

| ![sign in](https://github.com/user-attachments/assets/dc07f210-ee5e-43b1-be1b-b60fa1f13f5c) | ![create post](https://github.com/user-attachments/assets/94b913af-ffa5-4ffc-81dc-4525a9a892e7) |
| --- | --- |
