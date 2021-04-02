


class Scene  {

    constructor(pDiv) {
        this.mScene = new THREE.Scene();
        this.mCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.mCamera.position.z = 50;
        this.mRenderer = new THREE.WebGLRenderer();
        this.mRenderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.mRenderer.domElement);

        const aDirectionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
        aDirectionalLight1.position.set(-6, 10, 50);
        this.mScene.add(aDirectionalLight1);

        const aDirectionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
        aDirectionalLight2.position.set(6, -10, -50);
        this.mScene.add(aDirectionalLight2);

        var Node = function() {
            this.children = [];
            this.localMatrix = m4.identity();
            this.worldMatrix = m4.identity();
          };

        

        this.mCube = new Cube();
        

        this.ball_list = new Array();
        this.number_of_balls = 10;
        this.range_x = 20;
        this.range_y =25;
        this.range_z = 30;
        
        
       
         for(var i = 0; i < this.number_of_balls; i++){
            let singel_ball = new Ball();
            // random position
            let random_position = singel_ball.create_random_position(
                singel_ball.get_radius() ,this.ball_list , this.range_x,this.range_y , this.range_z);

            singel_ball.position.set(random_position.x , random_position.y , random_position.z);

            this.ball_list.push(singel_ball);
            this.mCube.add(this.ball_list[i]);

         }
         
        
        
        this.mScene.add(this.mCube);
       


        this.animate();
    }

   
    //_______________________________________________________

    gameLoop() {
        this.collision();
        this.ball_list.forEach(currBall => {
            currBall.move();
            
        });
        this.mCube.rotateY(0.01);
        this.mCube.rotateX(0.01);
         
        
    }
    //_______________________________________________________

    animate() {
        this.gameLoop();
        requestAnimationFrame(()=>this.animate());
        this.mRenderer.render(this.mScene, this.mCamera);
        
    }


    collision(){
        var relativeVelocity = new THREE.Vector3();
        var norma = new THREE.Vector3();
        var new_pos = new THREE.Vector3();
        for(var i = 0; i < this.number_of_balls; i++){
            var b1 = this.ball_list[i];
            for(var j = i+1; j < this.number_of_balls; j++){
                var b2 = this.ball_list[j];
                
                var p1 = b1.position;
                var p2 = b2.position; 
                var separation = p1.distanceTo( p2 ); // calculate the norma position
                
                if ( separation <= 2 * b1.get_radius() ) { // find a collision
                
                    new_pos.subVectors(p1 , p2 );
                    norma = new_pos.normalize();
                    

                    relativeVelocity.subVectors(b1.speed,b2.speed);
                    var dot = relativeVelocity.dot( norma );

					norma.multiplyScalar(dot);

                    b1.speed.subVectors(b1.speed , norma);
                    b2.speed.addVectors(b2.speed , norma);
                    
					

                }

            }
    
        }
    }
}


//////////////////////////////////////////////////////////////

class Cube extends THREE.Object3D {
    constructor() {
        super();
        const aGeometry = new THREE.BoxGeometry(40,50,100,2,2,2);
        const aMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, opacity: 0.6, transparent: true, side: THREE.DoubleSide });
        const aBox = new THREE.Mesh(aGeometry, aMaterial);
        this.add(aBox)
    }
}


//////////////////////////////////////////////////////////////

class Ball extends THREE.Object3D {
    constructor() {
        super();
        this.radius = 3;
        const aGeometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const aMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.mSphere = new THREE.Mesh(aGeometry, aMaterial);
        this.direction = new THREE.Vector3(1,1,1);
        // random speed
        var speed = 0.3;
        this.speed = new THREE.Vector3(speed * ( 2 * Math.random() - 1),
                                       speed * ( 2 * Math.random() - 1),
                                       speed * ( 2 * Math.random() - 1) );
        this.speed.normalize();
        this.add(this.mSphere);
         
    }

    get_radius(){
        return this.radius;
    }

    create_random_position(radius,ball_list, range_x , range_y , range_z){
        var collide;
        var random_position;
        
        do {
            random_position = new THREE.Vector3(( range_x - radius) * ( 2 * Math.random() - 1 ),
                                                ( range_y - radius ) * ( 2 * Math.random() - 1 ),
                                                ( range_z - radius ) * ( 2 * Math.random() - 1 ) );

            collide = false;
            ball_list.forEach(currBall => {
                if((currBall.position.distanceTo(random_position)) <= 2 * radius){
                    collide = true;
                }
            });
    
        }while(collide)
        
        return random_position;

    }

    //_______________________________
    move() {
        var speed_limit = 20;
       
   
            this.position.x += this.speed.x;
       
            this.position.x += this.speed.x;
      
            this.position.y += this.speed.y   ;
        
            this.position.z += this.speed.z  ;
       

        // touch the cube 
        if (this.position.x >= 17 ){
            this.speed.x *= -1;
            this.position.x = 17;
        }
        else if( this.position.x <= -17 ){
            this.speed.x *= -1;
            this.position.x = -17;
        }
        

        if (this.position.y >= 18 ){
            this.speed.y *= -1;
            this.position.y = 18;
        }
        else if (this.position.y <= -18){
            this.speed.y *= -1;
            this.position.y = -18;
        }
        
        

        if (this.position.z >= 30 ){
            this.speed.z *= -1;
            this.position.z = 30;
        }
        else if(this.position.z <= -30){
            this.speed.z *= -1;
            this.position.z = -30;
        }

        
       
        
    }

   

}

new Scene();