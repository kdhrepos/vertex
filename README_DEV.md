#Naming Convention & Code Style

## Database
### Variable
- 데이터 베이스와 관련된 변수들은 모두 Snake Case를 이용할 것
    - ex) contents_id
-  mysql를 사용하므로 snake case 이 외의 경우에는 에러 발생 가능

### Entity Definition
- entities 파일에서 모든 entity의 컬럼 정의 순서는 pk -> fk -> 그 외 attribute 순서로 할 것
- 보기 편함


## Common Case
- 주로 서버 코드 내부에서만 사용하는 변수, 클래스와 같은 네이밍은 Camel Case 이용할 것
    - ex) PostComment, postCommentProviders

## File Name
- 코드를 담고 있는 파일 이름은 "-"를 붙여 단어를 구분할 것
    - ex) post-comment

