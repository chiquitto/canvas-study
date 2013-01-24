var Math2 = {
	calcBallVolume: function(sphereRadius) {
		return 4/3 * Math.PI * (Math.pow(sphereRadius,3));
	},
	
	calcDensity: function(mass, volume) {
		return mass / volume;
	}
}


/**
 * @link http://codingowl.com/readblog.php?blogid=114
 * @link http://en.wikipedia.org/wiki/Billiard_ball
 */

var b2Vec2 = Box2D.Common.Math.b2Vec2,
b2BodyDef = Box2D.Dynamics.b2BodyDef,
b2Body = Box2D.Dynamics.b2Body,
b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
b2World = Box2D.Dynamics.b2World,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
b2Fixture = Box2D.Dynamics.b2Fixture,
b2AABB = Box2D.Collision.b2AABB;

var snooker = {
    SCALE: null,
    FPS: null,
    RADION: null,
    WIDTH: null,
    HEIGHT: null,
    CX: null,
    CY: null,

    o: null,
    world: null,
    debugDraw: null,
    init: function() {
        this.setupConfig();
        this.setupWorld();
        this.setupWalls();
        this.setupWhiteBall();
        this.setupBalls();
        
        window.setInterval(function() {
            snooker.update();
        }, 1000 / this.FPS);
    },
	
	setupBalls: function() {
		var ballRadius = 0.02625; // raio em metros
		var ballMassa = 0.13; // massa em kg
		
        var ballFixDef = new b2FixtureDef;
        ballFixDef.density = Math2.calcDensity(ballMassa, Math2.calcBallVolume(ballRadius));
        ballFixDef.friction = 5;
        ballFixDef.restitution = 0.1;
        ballFixDef.shape = new b2CircleShape(ballRadius * this.SCALE2 * 3);
		
		console.log(ballFixDef.density);

        // definicao da parede
        var ballBodyDef = new b2BodyDef;
        ballBodyDef.type = b2Body.b2_dynamicBody;
        ballBodyDef.position.Set(this.WIDTH-1, this.CY);

        ballBody = this.world.CreateBody(ballBodyDef);
        ballBody.CreateFixture(ballFixDef);
    },
    
    setupConfig: function() {
        this.SCALE = 100;
        this.SCALE2 = 2;
        this.FPS = 60;
        this.RADIUS = Math.PI / 180;
        this.WIDTH = 3.1 * this.SCALE2;
        this.HEIGHT = 1.7 * this.SCALE2;
        this.CX = this.WIDTH / 2;
        this.CY = this.HEIGHT / 2;

        this.o = document.getElementById('box2dcanvas');
        this.o.width = (this.WIDTH * this.SCALE);
        this.o.height = (this.HEIGHT * this.SCALE);
    },
    
    setupDebugDraw: function() {
        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetSprite(this.o.getContext('2d'));
        this.debugDraw.SetDrawScale(this.SCALE);
        this.debugDraw.SetFillAlpha(0.5);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(this.debugDraw);
    },
    
    setupWalls: function() {
        var paredeEspessura = 0.15 * this.SCALE2;
        var paredeMargem = 0 * 0.15 * this.SCALE2;
        
        // definicao do fixture da parede
        var paredeFixDef = new b2FixtureDef;
        paredeFixDef.density = 5;
        paredeFixDef.friction = 5;
        paredeFixDef.restitution = 0.8;
        paredeFixDef.shape = new b2PolygonShape;
        
        // definicao da parede
        var paredeBodyDef = new b2BodyDef;
        paredeBodyDef.type = b2Body.b2_staticBody;
        
        // cima
        paredeFixDef.shape.SetAsBox(this.CX - (paredeMargem * 2), paredeEspessura);
        paredeBodyDef.position.Set(this.CX, paredeEspessura/2);
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
        
        // baixo
        paredeBodyDef.position.Set(this.CX, this.HEIGHT - (paredeEspessura/2));
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
        
        // esquerda
        paredeFixDef.shape.SetAsBox(paredeEspessura, this.CY - (paredeMargem * 2));
        paredeBodyDef.position.Set(paredeEspessura/2, this.CY);
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
        
        // direita
        paredeBodyDef.position.Set(this.WIDTH - (paredeEspessura/2), this.CY);
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
    },
    
    setupWhiteBall: function() {
		var ballRadius = 0.029; // raio em metros
		var ballMassa = 0.15; // massa em kg
		
        var whiteballFixDef = new b2FixtureDef;
        whiteballFixDef.density = Math2.calcDensity(ballMassa, Math2.calcBallVolume(ballRadius));
        whiteballFixDef.friction = 5;
        whiteballFixDef.restitution = 0.1;
        whiteballFixDef.shape = new b2CircleShape(ballRadius * this.SCALE2 * 3);
		
		console.log(whiteballFixDef.density);
        
        // definicao da parede
        var whiteballBodyDef = new b2BodyDef;
        whiteballBodyDef.type = b2Body.b2_dynamicBody;
        whiteballBodyDef.position.Set(1, this.CY-0.05);
        
        // cima
        whiteballBody = this.world.CreateBody(whiteballBodyDef);
        whiteballBody.CreateFixture(whiteballFixDef);

        //whiteballBody.ApplyImpulse(new b2Vec2(0.03,0), whiteballBody.GetWorldCenter());
        whiteballBody.SetLinearVelocity(new b2Vec2(10 * this.SCALE2, 8));
    },
    
    setupWorld: function() {
        this.world = new b2World(new b2Vec2(0,0), true);
        this.setupDebugDraw();
    },
    
    update: function() {
        this.world.Step(1/this.FPS, 100, 100);
        this.world.DrawDebugData();
        this.world.ClearForces();
    }
}

$(document).ready(function(){
    snooker.init();
});

function update() {
    world.Step(1 / FPS, 100, 100);
    world.DrawDebugData();
    world.ClearForces();
}