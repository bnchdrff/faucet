module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email_is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      phone_number_is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      ip: {
        type: Sequelize.STRING,
      },
      ua: {
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  ),
  down: queryInterface => queryInterface.dropTable('apps'),
};