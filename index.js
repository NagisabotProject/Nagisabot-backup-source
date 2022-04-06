//定義系
const http = require("http");
const {Client,Intents,MessageEmbed} = require("discord.js");
const client = new Client({ intents: Object.keys(Intents.FLAGS)});
const fetch = require("node-fetch");
const {Signale} = require("signale");
const logger = new Signale();
const Keyv = require("keyv");
const isgd = require("isgd");
const token = process.env.BOT_TOKEN;
const prefix = process.env.BOT_PREFIX;
const {DiscordTogether} = require('discord-together');
client.discordTogether = new DiscordTogether(client);

//httpサーバー
http.createServer(function(req, res){
   res.write("OK");
   res.end();
}).listen(8080);

//起動構成
client.once("ready", () => {
	logger.success(`${client.user.tag}でログイン済み`);
	setInterval(() => {
  		var i = 4
  		if (i % 4 === 0) {
    		client.user.setActivity(`${prefix}help | ${client.guilds.cache.size}サーバー`, {type: "WATCHING" });
		};
		var i = 7
		if (i % 4 === 3) {
    		client.user.setActivity(`${prefix}ping | ${client.guilds.cache.map(guild => guild.memberCount).reduce((p, c) => p + c)}人のユーザー`, {type: "WATCHING" });
		};
	}, 5000);
});

client.on("guildCreate", async (guild) => {
  guild.fetchOwner().then((owner) =>
    owner.send({
		embeds:[new MessageEmbed()
			.setTitle("導入ありがとうございます！")
			.setDescription(`この度は数あるDiscordBotの中から**${client.user.username}**をお選びくださいましてありがとうございます。\n詳しい操作方法は${prefix}helpをご覧ください。`)
			.setFooter({text: `Sent from ${guild.name}`})
			.setColor("#2f3136")
			.setTimestamp("")
		]
	}),
	guild.channel.cache.get("952391502397571152").send({
		embeds: [new MessageEmbed()
			.setTitle("サーバー参加")
			.setDescription("`" + guild.name + "`に追加されました。")
		]
	})
  );
});

//メッセージコマンド
client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
  	if (!message.content.startsWith(prefix)) return;
  	const args = message.content.slice(prefix.length).trim().split(/ +/g);
  	const command = args.shift().toLowerCase();
	if (command === 'yt-together') {
        if(message.member.voice.channel) {
        	client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
                return message.channel.send(`${invite.code}`);
            })
        }
    } else if (command === "eval") {
    	if (!["716343156513439845"].includes(message.author.id)) return message.reply({ 
			embeds: [new MessageEmbed()
	        		.setColor('#ff0000')
	        		.setTitle(':tools:EVAL')
	        		.setDescription("あなたにはこのコマンドを実行する権限がありません。")
	        		.setTimestamp()
			], 
		});
    const code = args.join(" ");
    const result = new Promise((resolve) => resolve(eval(code)));
    return result.then(async (output) => {
        if (typeof output !== "string") {
          	output = require("util").inspect(output, { depth: 0 });
        }
        if (output.includes(client.token)) {
          	output = output.replace(client.token, "[TOKEN]");
        }
        message.reply(`\`\`\`js\n${output}\n\`\`\``);
    }).catch(async (err) => {
    	err = err.toString();
    	if (err.includes(client.token)) {
    		err = err.replace(client.token, "[TOKEN]");
    	}
    	message.reply(`\`\`\`js\n${err}\n\`\`\``);
    });
	} else if (command === "help") {
		message.reply({
			embeds: [new MessageEmbed()
				.setTitle(":question:ヘルプ")
				.setDescription("すべてのコマンドは`" + prefix + "`で始まる必要があります。")
				.setColor("#2f3136")
				.setFields(
					{
						name: ":link:is.gdリンク短縮",
						value: "`" + prefix + "isgd`"
					}
				)
			], allowedMentions : {repliedUser : false}
		})
	} else if (command === "reboot") {
		if (message.author.id !== "716343156513439845") return;
		client.destroy();
      		client.login(token);
		logger.success(`${client.user.tag}でリブート済み`)
		message.reply({
			embeds: [new MessageEmbed()
				.setTitle("再起動完了")
				.setDescription("BotClientを正常に再起動しました")
				.setColor("#2f3136")
			]
		})
	} else if (command === "isgd") {
     		if (message.author.bot) return;
    		const aarsd = args[0];
		if (!aarsd) return message.channel.send("空白がないまたは入力されていません")
    		isgd.shorten(aarsd, function (res) {
      			message.channel.send({
				embeds: [new MessageEmbed()
					.setTitle(":link:リンク短縮")
					.setDescription("指定されたURLを https://is.gd/ で短縮しました")
					.setFields(
						{
							name: "短縮後のリンク",
							value: "`" + res + "`"
						}
					)
					.setColor("#2f3136")
				]
			});
    		});
  	} else if (command === "about_me") {
        	message.reply({
            		embeds: [new MessageEmbed()
                		.setTitle("➴⡱私について")
                		.setDescription("おやおやぁ？キミは私の事が気になるんだな？いいでしょう、教えてあげます！")
                		.addFields(
                    			{
                        			name: "➴⡱自己紹介！",
                        			value: "私は三島渚！\nみんなを助けるお仕事をここ、Discordでやってるんだよ！\nいわばみんなのメイドさんだぞ！！"
                    			},
                    			{
                        			name: "➴⡱年齢",
                        			value: "秘密だよぉ！でも高校生です！"
                    			},
                    			{
                        			name:"➴⡱趣味",
                        			value:"みんなとおしゃべりすること、みんなにイタズラすること"
                    			}
                		)
                		.setColor("#2f3136")
            		], allowedMentions: {repliedUser: false}
        	})
    } else {
		message.reply({
			embeds: [new MessageEmbed()
				.setTitle(":warning:エラー")
				.setDescription("`" + message.content + "`というコマンドが見つかりませんでした！")
				.setFooter({text: `ErrorCode:${message.channel.lastMessageId}`})
				.setColor("RED")
			], allowedMentions: {repliedUser: false}
		})
	}
});

client.login(token);
