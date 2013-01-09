var    b2Vec2 = Box2D.Common.Math.b2Vec2
,      b2BodyDef = Box2D.Dynamics.b2BodyDef
,      b2Body = Box2D.Dynamics.b2Body
,      b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,      b2World = Box2D.Dynamics.b2World
,      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,      b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
,      b2DebugDraw = Box2D.Dynamics.b2DebugDraw
,      b2Fixture = Box2D.Dynamics.b2Fixture
,      b2AABB = Box2D.Collision.b2AABB
,	   b2Color = Box2D.Common.b2Color;

var SCALE = 10;
var FPS = 60;
var RADIAN = Math.PI / 180;
		
var world = new b2World(new b2Vec2(0, 9.8), true);

var quadradoFixDef = new b2FixtureDef;		
quadradoFixDef.density = 100;
quadradoFixDef.friction = 0.5;
quadradoFixDef.restitution = .5;

quadradoFixDef.shape = new b2PolygonShape;
quadradoFixDef.shape.SetAsBox(5,5);

var quadradoBodyDef = new b2BodyDef;
quadradoBodyDef.type = b2Body.b2_dynamicBody;

quadradoBodyDef.position.Set(10,10);
quadradoBodyDef.userData = 'QUADRADO1';
var quadradoBody1 = world.CreateBody(quadradoBodyDef);
quadradoBody1.CreateFixture(quadradoFixDef);
//quadradoBody1.SetPositionAndAngle(new b2Vec2(10,10), RADIAN*49);
//quadradoBody1.SetLinearVelocity(new b2Vec2( 2, 20 ) );
quadradoBody1.SetAngularVelocity(Math.PI*-1.2);

quadradoBodyDef.position.Set(40,10);
quadradoBodyDef.userData = 'QUADRADO2';
var quadradoBody2 = world.CreateBody(quadradoBodyDef);
quadradoBody2.CreateFixture(quadradoFixDef);
//quadradoBody2.SetLinearVelocity( new b2Vec2( 1, 1 ) );
quadradoBody2.SetAngularVelocity(Math.PI*2);

// Chao
var chaoBodyDef = new b2BodyDef;
chaoBodyDef.type = b2Body.b2_staticBody;
chaoBodyDef.position.Set(25,49);

var chaoFixDef = new b2FixtureDef;
chaoFixDef.shape = new b2PolygonShape;
chaoFixDef.shape.SetAsBox(25,1);

chaoBody = world.CreateBody(chaoBodyDef);
chaoBody.CreateFixture(chaoFixDef);

var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(document.getElementById('box2dcanvas').getContext('2d'));
debugDraw.SetDrawScale(SCALE);
debugDraw.SetFillAlpha(0.5);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

window.setInterval(update, 1000 / FPS);

function update() {
    world.Step(1 / FPS, 10, 0);
    world.DrawDebugData();
    world.ClearForces();
}