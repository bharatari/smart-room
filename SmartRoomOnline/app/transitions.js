export default function() {
 	this.transition(
    	this.fromRoute(['index']),
    	this.toRoute(['settings']),
    	this.use('toLeft'),
    	this.reverse('toRight')
  	);
};