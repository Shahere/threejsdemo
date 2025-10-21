A wbesite with docker that contain three example (3D for web).

Each of folder for a separate demo, rendered in a iframe at source.

TODO : 
- Voxel -> global code optimisation (pretty laggy at the moment)
- Firstperson and FirstPersonShoot -> improve euler angle (head can be reverse, need verification on camera pointing top)
- earthspin shader improvement -> ... shaders
- LightBox -> shaders, try to mke the substractive works


Pour ajouter un projet : 

Il faut changer la valeur minimum (actuellement -1147). Ça correspond a la position MINI du scroll =, nécessaire pour le calcul de la position des drapeaux

Donc : Ajouter une line / afficher en console.log la position du scroll / noter et modifier
et modifer le nombre de drapeau