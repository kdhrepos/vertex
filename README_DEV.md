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

## File Name

- 코드 파일 이름은 "-"를 붙여 단어를 구분할 것
  - ex) post-comment.controller.ts
