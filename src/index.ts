import * as THREE from 'three';
import { OBJLoader } from './OBJLoader.js';
import { MTLLoader } from  './MTLLoader.js';
import './styles.scss';
//import './frog.png'; //needed import images to copy to output
class Program
{
  private static currentTime: number;
  private static previousRenderTime: number = Date.now();
  private static intervalForTargetFrameRate: number = 1000/24.0;
  private static timeSinceLastFrameRender: number;

  private static renderer: THREE.WebGLRenderer; 
  private static canvas: HTMLCanvasElement; 
//  private static renderingContext: WebGLRenderingContext;
  //= new THREE.WebGLRenderer( { canvas: document.getElementById('CanvasID') as HTMLCanvasElement } );
  
  private static scene: THREE.Scene;
  private static camera: THREE.PerspectiveCamera;
  private static mesh: THREE.Mesh;

  public static SetRendererSize(): void
  {
    Program.renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight !== 0)
    {
      this.camera.aspect = window.innerWidth / window.innerHeight;
    }
  }

  private static initialize(): void
  {
    Program.canvas = document.getElementById('CanvasID') as HTMLCanvasElement;
    
    Program.renderer = new THREE.WebGLRenderer( { canvas: Program.canvas } );
    Program.scene = new THREE.Scene();
    Program.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    

    Program.camera.position.set(0, 5, 12);

    const mtlLoader = new MTLLoader();
    mtlLoader.load('https://raw.githubusercontent.com/wcdeich4/OBJSamples/main/Can.mtl',
        (materials) => {
            materials.preload();

            const objLoader: OBJLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                'https://raw.githubusercontent.com/wcdeich4/OBJSamples/main/Can.obj',
                (object) => {
                    Program.mesh = object;
                    Program.scene.add(object);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log('Error loading OBJ file: ' + error);
                }
            );
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.log('Error loading MTL file: ' + error);
        }
    );


    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 5, 12);
    Program.scene.add(light);

    window.onresize = Program.SetRendererSize;
  }

  public static RenderLoop(): void
  {
    window.requestAnimationFrame(Program.RenderLoop);
    //window.requestAnimationFrame(() => Program.RenderLoop());
    
    //frame rate calculations
    Program.currentTime = Date.now();
    Program.timeSinceLastFrameRender = Program.currentTime - Program.previousRenderTime;


    if (Program.timeSinceLastFrameRender >= Program.intervalForTargetFrameRate)
    {
      //adjust for time taken to render the frame
      Program.previousRenderTime = Program.currentTime - (Program.timeSinceLastFrameRender % Program.intervalForTargetFrameRate);

      //simulation per frame logic
      Program.mesh.rotation.x += 0.01;
      Program.mesh.rotation.y += 0.02;

      //finally do render
      Program.renderer.render(Program.scene, Program.camera);
    }


    
  
  }




  public static Main(): void
  {
    Program.initialize();
    Program.SetRendererSize();


    Program.RenderLoop();
  }
}

Program.Main();
