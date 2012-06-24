
CREATE TABLE IF NOT EXISTS `directory.department` (
  `departmentName`      varchar(128) CHARACTER SET utf8 NOT NULL,
  `buildingId`          int(4)       NOT NULL,
  `location`            varchar(128) CHARACTER SET utf8,
  `category`            varchar(64)  CHARACTER SET utf8,
  `description`         varchar(255) CHARACTER SET utf8,
  `website`             varchar(255) CHARACTER SET utf8,
  `abrv`                varchar(16)  CHARACTER SET utf8
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


