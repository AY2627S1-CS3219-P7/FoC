module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    "order",
    {
      order_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      requester_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      courier_id: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM(
          "OPEN",
          "ACCEPTED",
          "PICKED_UP",
          "COMPLETED",
          "CANCELLED",
          "EXPIRED"
        ),
        allowNull: false,
        defaultValue: "OPEN"
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      supplier_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      delivery_location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      credit_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1 }
      },
      accept_by: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      accepted_at: { type: Sequelize.DATE },
      picked_up_at: { type: Sequelize.DATE },
      completed_at: { type: Sequelize.DATE },
      cancelled_at: { type: Sequelize.DATE },
      expired_at: { type: Sequelize.DATE }
    },
    { 
      tableName: "orders",
      timestamps: false,
      indexes: [
        { name: "orders_status_accept_by_idx", fields: ["status", "accept_by"] },
        { name: "orders_requester_idx", fields: ["requester_id"] },
        { name: "orders_courier_idx", fields: ["courier_id"] }
      ] 
    }
  );

  return Order;
};
