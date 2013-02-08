var Math2 = {
	calcBallVolume: function(sphereRadius) {
		return 4/3 * Math.PI * (Math.pow(sphereRadius,3));
	},
	
	calcDensity: function(mass, volume) {
		return mass / volume;
	},
	
	getAngleDegrees: function (x1, y1, x2, y2) {
		return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
	}
}

var whiteballBody;


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

Box2D.Common.b2Settings.b2_velocityThreshold = 0;

var snooker = {
    SCALE: null,
    FPS: null,
    RADIUS: null,
    WIDTH: null,
    HEIGHT: null,
    CX: null,
    CY: null,
	
    o: null,
    world: null,
    debugDraw: null,
	oldPositions: {},
	minVelocity: 0.1,
	
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

        // definicao da parede
        var ballBodyDef = new b2BodyDef;
        ballBodyDef.type = b2Body.b2_dynamicBody;
		ballBodyDef.userData = 'BALL';
		ballBodyDef.linearDamping = .6;
        ballBodyDef.angularDamping = .6;
		
        ballBodyDef.position.Set(this.WIDTH-1.1, this.CY);
        ballBody1 = this.world.CreateBody(ballBodyDef);
        ballBody1.CreateFixture(ballFixDef);
		
		ballBodyDef.position.Set(this.WIDTH-1, this.CY-0.1);
        ballBody2= this.world.CreateBody(ballBodyDef);
        ballBody2.CreateFixture(ballFixDef);
		
		ballBodyDef.position.Set(this.WIDTH-1, this.CY+0.1);
        ballBody3= this.world.CreateBody(ballBodyDef);
        ballBody3.CreateFixture(ballFixDef);
    },
    
    setupConfig: function() {
        this.SCALE = 100;
        this.SCALE2 = 2;
        this.FPS = 30;
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
        
        // definicao da parede
        var whiteballBodyDef = new b2BodyDef;
        whiteballBodyDef.type = b2Body.b2_dynamicBody;
		whiteballBodyDef.linearDamping = .7;
        whiteballBodyDef.angularDamping = .7;
		whiteballBodyDef.userData = 'WHITE_BALL';
        whiteballBodyDef.position.Set(1, this.CY-0.05);
        
        // cima
        whiteballBody = this.world.CreateBody(whiteballBodyDef);
        whiteballBody.CreateFixture(whiteballFixDef);
		this.oldPositions[whiteballBodyDef.userData] = whiteballBody.GetPosition();

        //whiteballBody.ApplyImpulse(new b2Vec2(0.03,0), whiteballBody.GetWorldCenter());
        whiteballBody.SetLinearVelocity(new b2Vec2(15 * this.SCALE2, 0 * this.SCALE2));
    },
    
    setupWorld: function() {
        this.world = new b2World(new b2Vec2(0,0), true);
        this.setupDebugDraw();
    },
    
    update: function() {
		/*counter++;
		
		if ((counter % 1) == 0) {
			for (b = this.world.GetBodyList() ; b; b = b.GetNext()) {
				var userData = b.GetUserData();
				if ((userData == 'WHITE_BALL') || (userData == 'BALL')) {
					var v = b.GetLinearVelocity();
					var vx = v.x;
					var vy = v.y;
					
					if ( (vx == 0) && (vy == 0) ) {
						continue;
					}
					
					if ((counter % 10) == 0) {
						console.log('vx = ', vx);
						console.log('vy = ', vy);
					}
					
					vx = Math.abs(vx);
					vy = Math.abs(vy);
					if ( (vx < snooker.minVelocity) && (vy < snooker.minVelocity) ) {
						b.SetLinearVelocity(new b2Vec2(0,0));
						b.SetAngularVelocity(0);
						continue;
					}
					
					var p2 = b.GetPosition();
					var p1 = snooker.oldPositions[userData];
					
					var angle = Math2.getAngleDegrees(p1.x, p1.y, p2.x, p2.y);
					//var inverseAngle = (angle > 0) ? angle - 180 : angle + 180;
					
					var rel, forcaX, forcaY;
					rel = Math.abs(angle) / 90;
					if (angle < 0) {
						// angle < -90
						if (rel > 1) {
							forcaX = rel - 1;
							forcaY = 1 - forcaX;
						}
						// angle >= -90
						else {
							forcaY = rel;
							forcaX = 1 - forcaY;
						}
					}
					// angle > 0
					else {
						// angle > 90
						if (rel > 1) {
							forcaX = rel - 1;
							forcaY = 1 - forcaX;
						}
						// angle <= 90
						else {
							forcaY = rel;
							forcaX = 1 - forcaY;
						}
					}
					
					if ( (angle > 90) || (angle < -90) ) {
						forcaX *= -1;
					}
					if (angle < 0) {
						forcaY *= -1;
					}
					
					var applyForce = true;
					//if (vx < snooker.minVelocity) {
					//	forcaX = 0;
					//	b.SetLinearVelocity(new b2Vec2(0, vy));
					//	applyForce = false;
					//	console.log('b.SetLinearVelocity(new b2Vec2(0,vy));');
					//}
					//
					//if (vy < snooker.minVelocity) {
					//	forcaY = 0;
					//	b.SetLinearVelocity(new b2Vec2(vx, 0));
					//	applyForce = false;
					//	console.log('b.SetLinearVelocity(new b2Vec2(vx, 0));');
					//}
					
					if (applyForce) {
						forcaX = -forcaX * 100;
						forcaY = -forcaY * 100;
					}
					
					b.ApplyForce(new b2Vec2(forcaX, forcaY), b.GetWorldCenter());
					
					snooker.oldPositions[userData] = {x:p2.x, y:p2.y};
				}
			}
		}*/
		
        this.world.Step(1 / this.FPS, 4, 8);
		
		/*for (b = this.world.GetBodyList() ; b; b = b.GetNext()) {
			if ((b.GetUserData() == 'WHITE_BALL') || (b.GetUserData() == 'BALL')) {
				b.SetLinearVelocity(new b2Vec2(b.GetLinearVelocity().x * parar, b.GetLinearVelocity().y * parar));
				b.SetAngularVelocity(b.GetAngularVelocity() * parar);
			}
		}*/
		
        this.world.DrawDebugData();
        this.world.ClearForces();
    }
}

var counter = 0;
var parar = .995;

$(document).ready(function(){
    snooker.init();
});