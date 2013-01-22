/**
 * @link http://codingowl.com/readblog.php?blogid=114
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

var SCALE = 10;
var FPS = 60;
var RADIAN = Math.PI / 180;
var WIDTH = 800 / SCALE;
var HEIGHT = 400 / SCALE;
var CX = WIDTH / 2;
var CY = HEIGHT / 2;

var snooker = {
    SCALE: null,
    FPS: null,
    RADION: null,
    WIDTH: null,
    HEIGHT: null,
    CX: null,
    CY: null,
    
    world: null,
    debugDraw: null,
    init: function() {
        this.setupConfig();
        this.setupWorld();
        this.setupWalls();
        //this.setupBalls();
        
        window.setInterval(function() {
            snooker.update();
        }, 1000 / this.FPS);
    },
    
    setupConfig: function() {
        this.SCALE = 10;
        this.FPS = 60;
        this.RADION = Math.PI / 180;
        this.WIDTH = 800 / SCALE;
        this.HEIGHT = 400 / SCALE;
        this.CX = WIDTH / 2;
        this.CY = HEIGHT / 2;
    },
    
    setupDebugDraw: function() {
        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetSprite(document.getElementById('box2dcanvas').getContext('2d'));
        this.debugDraw.SetDrawScale(SCALE);
        this.debugDraw.SetFillAlpha(0.5);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(this.debugDraw);
    },
    
    setupWalls: function() {
        var paredeEspessura = 0.5;
        var paredeMargem = 1;
        
        // definicao do fixture da parede
        var paredeFixDef = new b2FixtureDef;
        paredeFixDef.density = 5;
        paredeFixDef.friction = 5;
        paredeFixDef.restitution = 1;
        paredeFixDef.shape = new b2PolygonShape;
        
        // definicao da parede
        var paredeBodyDef = new b2BodyDef;
        paredeBodyDef.type = b2Body.b2_staticBody;
        
        // cima
        paredeFixDef.shape.SetAsBox(this.CX - paredeMargem, paredeEspessura);
        paredeBodyDef.position.Set(this.CX, paredeEspessura/2);
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
        
        // baixo
        paredeBodyDef.position.Set(this.CX, this.HEIGHT - (paredeEspessura/2));
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
        
        // esquerda
        paredeFixDef.shape.SetAsBox(paredeEspessura, this.CY - paredeMargem);
        paredeBodyDef.position.Set(paredeEspessura/2, this.CY);
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
        
        // direita
        paredeBodyDef.position.Set(this.WIDTH - (paredeEspessura/2), this.CY);
        paredeBody = this.world.CreateBody(paredeBodyDef);
        paredeBody.CreateFixture(paredeFixDef);
    },
    
    setupWorld: function() {
        this.world = new b2World(new b2Vec2(0, 0), true);
        this.setupDebugDraw();
    },
    
    update: function() {
        this.world.Step(1 / this.FPS, 8, 3);
        this.world.DrawDebugData();
        this.world.ClearForces();
    }
}

$(document).ready(function(){
    snooker.init();
});

function update() {
    world.Step(1 / FPS, 8, 3);
    world.DrawDebugData();
    world.ClearForces();
}