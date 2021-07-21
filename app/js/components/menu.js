//Menu
function Menu(delay, closeOverlay = true) {
	this.state = null
	this.delay = delay
	this.closeOverlay = closeOverlay

	this.setState = (delay) => {
		body.setState()
		
		this.icon.style.pointerEvents = 'none'
		this.menu.style.pointerEvents = 'none'
		
		this.icon.classList.toggle('iconMenu--active')
		this.menu.classList.toggle('menu--active')
		setTimeout(() => {
			this.icon.style.pointerEvents = ''
			this.menu.style.pointerEvents = ''
		}, delay)
		return this.state = this.state === 'closed' ? 'opened' : 'closed'
	}
	
	this.init = (delay) => {
		this.icon = document.querySelector('.iconMenu')
		this.menu = document.querySelector('.menu')
		if (this.icon && this.menu) this.icon.addEventListener('click', () => this.setState(this.delay))
		if (this.closeOverlay) this.menu.addEventListener('click', (event) => {
			if(event.target === this.menu) this.setState(this.delay)
		})
		return this.state = 'closed'
	}
}
const menu = new Menu(600)
menu.init()
//=================