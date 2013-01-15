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

var world, debugDraw;
var body1, body2, myjoint, pulleyjoint;

function init() {
	world = new b2World(new b2Vec2(0, 9.8), true);
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.Set(15,6);
	
	var fixDef = new b2FixtureDef;
	fixDef.density = 25;
	fixDef.friction = 0.5;
	fixDef.restitution = 1;
	fixDef.shape = new b2CircleShape(2);
	
	body1 = world.CreateBody(bodyDef);
	body1.CreateFixture(fixDef);
	
	fixDef.density = 15;
	bodyDef.position.Set(65,5);
	body2 = world.CreateBody(bodyDef);
	body2.CreateFixture(fixDef);
	
	//  joints
	myjoint = new b2PulleyJointDef();
	var worldAnchorOnBody1 = body1.GetWorldCenter();
	var worldAnchorOnBody2 = body2.GetWorldCenter();
	var worldAnchorGround1 = new b2Vec2(35,3);
	var worldAnchorGround2 = new b2Vec2(45,3);
	var ratio = 1;
	myjoint.Initialize(body1, body2, worldAnchorGround1, worldAnchorGround2, worldAnchorOnBody1, worldAnchorOnBody2, ratio);
	myjoint.maxLengthA = 20;
	pulleyjoint = world.CreateJoint(myjoint);

	debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById('box2dcanvas').getContext('2d'));
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);

	window.setInterval(update, 1000 / FPS);
}
$(document).ready(init);

function update() {
	world.Step(1 / FPS, 8, 3);
	world.DrawDebugData();
	world.ClearForces();
}