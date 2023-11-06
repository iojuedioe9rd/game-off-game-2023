import { isUndefined } from "lodash"


export default class HealthSystem {
    private health: number
    private maxHealth: number
    private onHeal: HealthCallback
    private onDamage: HealthCallback
    private onDied: HealthCallback

    public Damage(amount: number)
    {
        this.onDamage(this.health, Math.max( this.health -amount, 0))
        if(Math.max( this.health -amount, 0) === 0)
        {
            this.onDied(this.health, 0)
            this.health = 0
            return
        }
        this.health = Math.max( this.health -amount, 0)
    }
     
    public get Health() : number {
        return this.health
    }

    public get MaxHealth() : number {
        return this.maxHealth
    }

    public Heal(amount: number)
    {
        if(this.health + amount >= this.maxHealth)
        {
            this.health = this.maxHealth
            if(isUndefined(this.onHeal))
            {
                (this.onHeal as any)(this.health, this.health)
            }
            
            return
        }

        if(isUndefined(this.onHeal))
            {
                (this.onHeal as any)(this.health, this.health + amount)
            }

        this.health += amount

    }
    


    constructor(health: number, {onHeal = () => {}, onDamage = () => {}, onDied = () => {}}: Partial<{onHeal: HealthCallback, onDamage: HealthCallback, onDied: HealthCallback}> )
    {
        
        
        
        this.onHeal = onHeal
        this.onDamage = onDamage
        this.onDied = onDied
        this.health = health
        this.maxHealth = health
    }
}