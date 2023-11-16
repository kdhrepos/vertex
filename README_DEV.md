# Naming Convention & Code Style

- 본 문서는 서버 개발 시 지켜야 할 Naming Convention 등에 대해 다룸

## General

- 주로 서버 코드 내부에서만 사용하는 변수, 클래스와 같은 네이밍은 Camel Case 이용할 것
  - ex) PostComment, updateVideo

## Database

### Columns

- 데이터 베이스와 관련된 변수들은 모두 Snake Case를 이용할 것
  - ex) contents_id
- mysql를 사용하므로 snake case 이 외의 경우에는 에러 발생 가능

### Model Definition

- Model 파일에서 모든 model 컬럼 정의 순서는 pk -> fk -> 그 외 attribute 순서로 할 것
- 보기 편하기 때문

### Query

- Sequelize 통해서 DB에 있는 데이터 가져올 때 옵션으로 raw:true 붙여야 쓸데없는 데이터까지 안나옴
  - ex) user.findAll({where : {~~},raw : true})
  - 하지만, 이 방식은 update 쿼리 날릴 수가 없으므로 주의

## File Name : Code

- 코드 파일 이름은 "-"를 붙여 단어를 구분할 것
  - ex) post-comment.controller.ts

## Hash

- 사용자의 비디오, 게시글 등의 파일 이름은 `${bcrypt.hash(유저 이메일,customSalt)}``{file.originalname}` 으로 할 것
- 사용자의 비밀번호나, 파일 이름 등을 해시로 저장할 건데, 비밀번호는 상관 없지만 파일 이름을 그냥 bcrypt.hashSync 를 쓰면 "/", 가 포함되므로 의도치 않은 디렉토리가 만들어진다. 그러므로 "/" 를 없애도록 할 것
  - [firebaseService.uploadVideo] 함수 참조
