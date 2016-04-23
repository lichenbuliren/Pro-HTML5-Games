var game = {
    // 开始初始化对象，预加载资源，并显示开始画面
    init: function(){
        // 初始化关卡对象
        levels.init();
        loader.init();

        // 隐藏所有图层，显示开始画面
        $('.game-layer').hide();
        $('#game-start-screen').show();

        this.canvas = $('#game-canvas')[0];
        this.context = this.canvas.getContext('2d');
    },

    showLevelScreen: function(){
        $('.game-layer').hide();
        $('#level-select-screen').show('slow');
    }
};

var levels = {
    // 关卡数据
    data: [{
        foreground: 'desert-foreground',
        background: 'clouds-background',
        entities: []
    },{
        foreground: 'desert-foreground',
        background: 'clouds-background',
        entities: []
    }],

    init: function(){
        var _html = '';
        var _this = this;
        for(var i=0;i<this.data.length;i++){
            var level = this.data[i];
            _html += '<input type="button" value="'+(i+1)+'">';
        };

        $('#level-select-screen').html(_html);

        $('#level-select-screen input').on('click',function(){
            _this.load(this.value -1);
            $('#level-select-screen').hide();
        });
    },

    load: function(number){
        game.currentLevel = {
            number: number,
            hero: []
        };
        game.score = 0;
        $('#score').html('Score: ' + game.score);

        var level = this.data[number];

        game.currentLevel.backgroundImage = loader.loadImage('images/backgrounds/' + level.background + '.png');
        game.currentLevel.foregroundImage = loader.loadImage('images/backgrounds/' + level.foreground + '.png');
        game.slingshotImage = loader.loadImage('images/slingshot.png');
        game.slingshotFrontImage = loader.loadImage('images/slingshot-front.png');

        if(loader.loaded){
            game.start();
        }else{
            loader.onload = game.start;
        }
    }
};

var loader = {
    loaded: true,
    loadedCount: 0,
    totalCount: 0,
    soundFileExtn: '.ogg',

    init: function(){
        // 检查浏览器支持的声音格式
        var mp3Support,oggSupport;
        var audio = document.createElement('audio');
        if(audio.canPlayType){
            // 当前 canPlayType()方法返回 '','maybe','probably'
            mp3Support = '' != audio.canPlayType('audio/mpeg');
            oggSupport = '' != audio.canPlayType('audio/ogg; codecs="vorbis"');
        }else{
            // audio 标签不支持
            mp3Support = false;
            oggSupport = false;
        }

        this.soundFileExtn = oggSupport ? '.ogg' : mp3Support ? '.mp3' : undefined;
    },

    loadImage: function(url){
        this.totalCount++;
        this.loaded = false;
        $('#loading-screen').show();
        var image = new Image();
        image.src = url;
        image.onload = this.itemLoaded;
        return image;
    },

    loadSound: function(url){
        this.totalCount++;
        this.loaded = false;
        $('#loading-screen').show();
        var audio = new Audio();
        audio.src = url + this.soundFileExtn;
        audio.addEventListener('canplaythrough', this.itemLoaded,false);
        return audio;
    },

    itemLoaded: function(){
        loader.loadedCount++;
        $('#loading-message').html('Loaded ' + loader.loadedCount + ' of ' + loader.totalCount);

        if(loader.loadedCount == loader.totalCount){
            loader.loaded = true;
            $('#loading-screen').hide();
            if(loader.onload){
                loader.onload();
                loader.onload = undefined;
            }
        }
    }
}

$(window).load(function(){
    game.init();;
});