Dataset understanding + code understanding:
	In this dataset we were already given the same picture with varying intensities of fog. 
	llma == clear/fog-less pictures
	k,l,m,u are folders with varying (lesser to more) intensities of fog (i don't recall which one is the least and which one is the most)
	
Code understanding:
	1. don't touch the data augmentation wala code box.
	2. don't touch the one with which i've already commented to not rerun 
	3. All the models are trained like so:
		k (fogged) vs llma (clear) ; l (fogged vs llma (clear) ; and so on.
	
Protip for if you try to run anything on your own devices:
	1. Batchsize == this is basically how many elements from your array it is going to pick up (in chunks) and try to keep in it's memory
		and perform processing on. If you do not have a very powerful cpu in your pc i would suggest keep the batch size to <= 5 and not more.
	
HAVE FUN!
PS: remember to change directories to your own!
