/**
 * Created by jnornhold on 11/16/16.
 */


module.exports = (controller, bot)=> {
  controller.hears('hand', 'direct_mention', (bot, message) => {
    bot.reply(message, 'Hi!');
  });

  controller.hears('play (\d) (\d)', 'direct_mention', (bot, message) => {

  });

  controller.hears('pass', 'direct_mention', (bot, message) => {

  });
}