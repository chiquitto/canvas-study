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
,	   b2Color = Box2D.Common.b2Color
,	b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var SCALE = 10;
var FPS = 60;
var RADIAN = Math.PI / 180;
		
var world = new b2World(new b2Vec2(0, 9.8), true);

// Carro
var carroFixDef = new b2FixtureDef;		
carroFixDef.density = 5;
carroFixDef.friction = 1;
carroFixDef.restitution = .1;
carroFixDef.shape = new b2PolygonShape;
carroFixDef.shape.SetAsBox(6,3);

var carroBodyDef = new b2BodyDef;
carroBodyDef.type = b2Body.b2_dynamicBody;
carroBodyDef.position.Set(15,34);
carroBodyDef.userData = 'CARRO';

var carroBody = world.CreateBody(carroBodyDef);
carroBody.CreateFixture(carroFixDef);
//carroBody.SetLinearVelocity(new b2Vec2( 0, -20 ) );

// Carroça
carroFixDef.shape.SetAsBox(3,2);

carroBodyDef.position.Set(3,35);
carroBodyDef.userData = 'CARROCA';
var carrocaBody = world.CreateBody(carroBodyDef);
carrocaBody.CreateFixture(carroFixDef);

// Rodas do carro
var rodaFixDef = new b2FixtureDef;
rodaFixDef.density = 5;
rodaFixDef.friction = 5;
rodaFixDef.restitution = .1;
rodaFixDef.shape = new b2CircleShape(1);

var rodaBodyDef = new b2BodyDef;
rodaBodyDef.type = b2Body.b2_dynamicBody;
rodaBodyDef.position.Set(12,37);
rodaBodyDef.userData = 'RODA_E';

var rodaEBody = world.CreateBody(rodaBodyDef);
rodaEBody.CreateFixture(rodaFixDef);

rodaBodyDef.position.Set(18,37);
rodaBodyDef.userData = 'RODA_D';
var rodaDBody = world.CreateBody(rodaBodyDef);
rodaDBody.CreateFixture(rodaFixDef);

// Roda da carroca
rodaBodyDef.position.Set(3,37);
var rodaCarrocaBody = world.CreateBody(rodaBodyDef);
rodaCarrocaBody.CreateFixture(rodaFixDef);

// Junção
var revoluteJointDef1 = new b2RevoluteJointDef();
revoluteJointDef1.Initialize(carroBody, rodaEBody, rodaEBody.GetWorldCenter());
//revoluteJointDefB.lowerAngle = -Math.PI/2;  (-90 degrees)
//revoluteJointDefB.upperAngle = Math.PI/4; (45 degrees)
//revoluteJointDefA.enableLimit = true;
revoluteJointDef1.maxMotorTorque = 2000.0;
revoluteJointDef1.motorSpeed = 30;
revoluteJointDef1.enableMotor = true;
revoluteJointA = world.CreateJoint(revoluteJointDef1);

var revoluteJointDef2 = new b2RevoluteJointDef();
revoluteJointDef2.Initialize(carroBody, rodaDBody, rodaDBody.GetWorldCenter());
/*revoluteJointDef1.maxMotorTorque = 1100.0;
revoluteJointDef1.motorSpeed = 3.0;
revoluteJointDef1.enableMotor = true;*/
revoluteJointB = world.CreateJoint(revoluteJointDef2);

revoluteJointDef3 = new b2RevoluteJointDef();
revoluteJointDef3.Initialize(carrocaBody, rodaCarrocaBody, rodaCarrocaBody.GetWorldCenter());
revoluteJointC = world.CreateJoint(revoluteJointDef3);

revoluteJointDef4 = new b2RevoluteJointDef();
revoluteJointDef4.Initialize(carrocaBody, carroBody, carroBody.GetWorldCenter());
revoluteJointDef4.maxMotorTorque = 2000.0;
revoluteJointDef4.motorSpeed = 30;
revoluteJointDef4.enableMotor = true;
revoluteJointD = world.CreateJoint(revoluteJointDef4);

// Chao
var chaoBodyDef = new b2BodyDef;
chaoBodyDef.type = b2Body.b2_staticBody;
chaoBodyDef.position.Set(40,39);

var chaoFixDef = new b2FixtureDef;
chaoFixDef.shape = new b2PolygonShape;
chaoFixDef.shape.SetAsBox(40,1);

chaoBody = world.CreateBody(chaoBodyDef);
chaoBody.CreateFixture(chaoFixDef);

// Obstaculo
chaoFixDef.shape.SetAsBox(1,1);
for(x=0; x<=75; x+=5) {
    chaoBodyDef.position.Set(x,38.9);
    obstaculoBody = world.CreateBody(chaoBodyDef);
    obstaculoBody.CreateFixture(chaoFixDef);
}

var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(document.getElementById('box2dcanvas').getContext('2d'));
debugDraw.SetDrawScale(SCALE);
debugDraw.SetFillAlpha(0.5);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

window.setInterval(update, 1000 / FPS);

function update() {
    world.Step(1 / FPS, 8, 3);
    world.DrawDebugData();
    world.ClearForces();
}