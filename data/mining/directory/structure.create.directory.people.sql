
CREATE TABLE IF NOT EXISTS `directory.people` (
  `lastName`         varchar(64) CHARACTER SET utf8 NOT NULL,
  `firstName`        varchar(64) CHARACTER SET utf8 NOT NULL,
  `department`       varchar(64) CHARACTER SET utf8,
  `branch`           varchar(64) CHARACTER SET utf8,
  `role`             varchar(64) CHARACTER SET utf8,
  `title`            varchar(128) CHARACTER SET utf8,
  `abrv`             varchar(16) CHARACTER SET utf8,
  `email`            varchar(128) CHARACTER SET utf8,
  `phone`            varchar(16) CHARACTER SET utf8,
  `location`         varchar(64) CHARACTER SET utf8,
  `website`          varchar(256) CHARACTER SET utf8,
  `mailcode`         int(5),
  `photo`            blob,
  INDEX `name` (`lastName`, `firstName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
