import {FC} from 'react'

import {ScrollingText} from '@/components/ScrollingText/ScrollingText'

import styles from './Matboj.module.scss'

export const Matboj: FC = () => {
  return (
    <>
      <div className={styles.mainText}>
        <p>
          Matboj je matematická súťaž pre štvorčlenné tímy žiakov stredných škôl a príslušných ročníkov viacročných
          gymnázií, ktorá prebieha každý rok koncom októbra v Košiciach.
        </p>
        <p>
          Každému tímu je pridelený koeficient (jeho úlohou je vyrovnávať rozdiely medzi tímami spôsobené rôznymi
          ročníkmi a skúsenosťami účastníkov). Koeficient K je definovaný ako: K=2.8−S/20, kde S je súčet ročníkov
          všetkých členov tímu. V prípade, že ma tím menej ako štyroch členov, každá &quot;prázdna stolička&quot; sa do
          tohto súčtu počíta ako štvrták.
        </p>
        <p>
          Súťaž prebieha v troch kolách (Medzi kolami sú len krátke prestávky, ktoré trvajú 5 minút). Každé trvá 30
          minút a tím počas neho dostane zadanie s 12 úlohami a odpoveďový hárok. Každá úloha má výsledok vo forme
          čísla, jednoduchého výrazu ... nevyžaduje sa celé riešenie.
        </p>
        <p>
          Za každú správne vypočítanú úlohu v odpoveďovom hárku dostáva tím K bodov. Za zle vypočítanú −1 bod. Za žiadnu
          odpoveď 0 bodov.
        </p>
        <p>Cieľom je nazbierať v troch kolách čo najviac bodov.</p>
      </div>
      <div className={styles.archive}>
        <div>Košický Matboj 2020</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2019</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2018</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2017</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2016</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2015</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2014</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2013</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2012</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2011</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2010</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2009</div>
        <div>Zadanie</div>
        <div>Poradie</div>
        <div>Košický Matboj 2008</div>
        <div>Zadanie</div>
        <div>Poradie</div>
      </div>
    </>
  )
}
