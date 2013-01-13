/**
 * @link http://codingowl.com/readblog.php?blogid=114
 */

var    b2Vec2 = Box2D.Common.Math.b2Vec2,
b2BodyDef = Box2D.Dynamics.b2BodyDef,
b2Body = Box2D.Dynamics.b2Body,
b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
b2World = Box2D.Dynamics.b2World,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
b2Fixture = Box2D.Dynamics.b2Fixture,
b2AABB = Box2D.Collision.b2AABB,
b2Color = Box2D.Common.b2Color,
b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var SCALE = 10;
var FPS = 60;
var RADIAN = Math.PI / 180;

var world, debugDraw, canvasPosition;
var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;

function init() {
    canvasPosition = getElementPosition('box2dcanvas');

    world = new b2World(new b2Vec2(0, 9.8), true);

    // Circulos
    var circuloFixDef = new b2FixtureDef;
    circuloFixDef.density = 5;
    circuloFixDef.friction = 5;
    circuloFixDef.restitution = .1;
    circuloFixDef.shape = new b2CircleShape(3);

    var circuloBodyDef = new b2BodyDef;
    circuloBodyDef.type = b2Body.b2_dynamicBody;
    circuloBodyDef.position.Set(12,36);
    //circuloBodyDef.userData = 'RODA_E';

    var rodaEBody = world.CreateBody(circuloBodyDef);
    rodaEBody.CreateFixture(circuloFixDef);

    // Chao
    var chaoBodyDef = new b2BodyDef;
    chaoBodyDef.type = b2Body.b2_staticBody;
    chaoBodyDef.position.Set(40,39);

    var chaoFixDef = new b2FixtureDef;
    chaoFixDef.shape = new b2PolygonShape;
    chaoFixDef.shape.SetAsBox(40,1);

    chaoBody = world.CreateBody(chaoBodyDef);
    chaoBody.CreateFixture(chaoFixDef);

    debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById('box2dcanvas').getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / FPS);

    document.addEventListener("mousedown", function(e) {
	console.log('mousedown');
	   isMouseDown = true;
	   handleMouseMove(e);
	   document.addEventListener("mousemove", handleMouseMove, true);
    }, true);
     
    document.addEventListener("mouseup", function() {
	console.log('mouseup');
	   document.removeEventListener("mousemove", handleMouseMove, true);
	   isMouseDown = false;
	   mouseX = undefined;
	   mouseY = undefined;
    }, true);
}
$(document).ready(init);
		
//mouse
function handleMouseMove(e) {
       mouseX = (e.clientX - canvasPosition.x) / SCALE;
       mouseY = (e.clientY - canvasPosition.y) / SCALE;
};
 
function getBodyAtMouse() {
       mousePVec = new b2Vec2(mouseX, mouseY);
       var aabb = new b2AABB();
       aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
       aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
     
       // Query the world for overlapping shapes.
       selectedBody = null;
       world.QueryAABB(getBodyCB, aabb);
       return selectedBody;
}
 
function getBodyCB(fixture) {
       if(fixture.GetBody().GetType() != 0) { //Static Bodies have type 0
	      if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
	             selectedBody = fixture.GetBody();
	             return false;
	      }
       }
       return true;
}
 
function getElementPosition(id) {
    var o = $('#' + id).offset();

        return {
	x: o.left,
	y: o.top
    };
}

function update() {
    if(isMouseDown && (!mouseJoint)) {
	    var body = getBodyAtMouse();
	    if(body) {
	            var md = new b2MouseJointDef();
	            md.bodyA = world.GetGroundBody();
	            md.bodyB = body;
	            md.target.Set(mouseX, mouseY);
	            md.collideConnected = true;
	            md.maxForce = 300.0 * body.GetMass();
	            mouseJoint = world.CreateJoint(md);
	            body.SetAwake(true);
	    }
    }
    if(mouseJoint) {
	    if(isMouseDown) {
	            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
	    }
	    else {
	            world.DestroyJoint(mouseJoint);
	            mouseJoint = null;
	    }
    }

    world.Step(1 / FPS, 8, 3);
    world.DrawDebugData();
    world.ClearForces();
}