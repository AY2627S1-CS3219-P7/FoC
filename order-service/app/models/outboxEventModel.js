/**
 * AI Assistance Disclosure
 * Tool: Claude (Sonnet 5.5)
 * Scope: Transactional outbox table for reliable RabbitMQ publishing
 *
 * Doing both order status change and a RabbitMQ publish directly can fail halfway
 * Instead, the event is written to this table in the SAME database
 * transaction as the status change. The outbox relay then publishes
 * unpublished rows to RabbitMQ and marks them done, retrying until it works.
 */

module.exports = (sequelize, Sequelize) => {
    return sequelize.define(
    "outbox_event",
    {
      event_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      event_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // The full event envelope, exactly as it will be published
      payload: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      published_at: {
        type: Sequelize.DATE
      }
    },
    {
      tableName: "outbox_events",
      timestamps: false,
      indexes: [
        {
          // Partial index: only the (usually tiny) set still waiting to be sent
          name: "outbox_unpublished_idx",
          fields: ["created_at"],
          where: { published_at: null }
        }
      ]
    }
  );
};