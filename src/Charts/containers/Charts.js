import React, { useEffect, useState } from 'react'

import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';


import '../styles/charts.scss';

const db= firebase.firestore(firebase);

export function Charts() {

    return  ( 
            <>
                    
                 <h1> Reportes</h1>
             </>
    )
}
