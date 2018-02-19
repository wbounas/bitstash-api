## Front-End Links
 [Live Page](https://alkazams-shark-assassins.github.io/bitstash-client/)
 [GitHub Repo](https://github.com/alkazams-shark-assassins/bitstash-client)

## Back-End Links
[Live Page](https://desolate-eyrie-66077.herokuapp.com/)
[GitHub Repo](https://github.com/alkazams-shark-assassins/bitstash-api)

## Catalog of Routes

### **API End-Points**

| HTTP Verb | URI Pattern         | Controller#Action |
|--------|------------------------|-------------------|
| post   | `/sign-up`             | `User#signup`    |
| post   | `/sign-in`             | `User#signin`    |
| delete | `/sign-out/:id`        | `User#signout`   |
| patch  | `/change-password/:id` | `User#changepw`  |
| post   | `/files`         | `File#create`  |
| get    | `/files/`        | `File#index` |
| get    | `/files/:id`     | `File#show` |
| delete | `/files/:id`     | `File#destroy` |
| patch  | `/files/:id`     | `File#update` |


## Entity Relationship Diagram

![ERD](planning/BitStash_ERD.png)
