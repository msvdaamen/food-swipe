create table measurements (
    id bigint generated by default as identity primary key,
    name varchar(255) not null,
    abbreviation varchar(255) not null
);