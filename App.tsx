import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Button, View, Text, TextInput, Image, StyleSheet} from 'react-native';

interface FormData {
  monto: string;
}

const App = () => {
  const [monto, setMonto] = useState<string>('');
  const [resultados, setResultados] = useState<
    {denominacion: number; billetes: number}[]
  >([]);

  const onSubmit = () => {
    const montoFloat = parseFloat(monto);
    if (!isNaN(montoFloat)) {
      try {
        const resultadoRetiro = retirar(montoFloat);
        console.log(resultadoRetiro);
        setResultados(resultadoRetiro);
        setMonto('');
      } catch (error) {
        console.error(error);
        setResultados([]);
      }
    } else {
      console.error('El monto ingresado no es válido');
      setResultados([]);
    }
  };

  function retirar(valor: number): {denominacion: number; billetes: number}[] {
    const denominaciones: number[] = [10000, 20000, 50000, 100000];
    const billetes_a_entregar: number[] = [0, 0, 0, 0];
    let contador: number = 0;

    while (valor > 0) {
      let entra: boolean = false;
      for (let i = contador; i < denominaciones.length; i++) {
        if (valor >= denominaciones[i]) {
          billetes_a_entregar[i]++;
          valor -= denominaciones[i];
          entra = true;
        }
      }
      if (!entra && contador === denominaciones.length) {
        throw new Error(
          'El monto no se puede desglosar en billetes de las denominaciones disponibles.',
        );
      } else {
        contador++;
      }
    }

    let resultados: {denominacion: number; billetes: number}[] = [];
    for (let i = 0; i < denominaciones.length; i++) {
      resultados.push({
        denominacion: denominaciones[i],
        billetes: billetes_a_entregar[i],
      });
    }

    return resultados;
  }

  const showBilletes = (denominacion: number): JSX.Element => {
    let imagenSource;
    switch (denominacion) {
      case 10000:
        imagenSource = require('./assets/billete10.jpg');
        break;
      case 20000:
        imagenSource = require('./assets/billete20.jpg');
        break;
      case 50000:
        imagenSource = require('./assets/billete50.jpg');
        break;
      case 100000:
        imagenSource = require('./assets/billete100.jpg');
        break;
      default:
        imagenSource = require('./assets/billetes.jpg');
        break;
    }
    return <Image source={imagenSource} style={styles.image} />;
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        value={monto}
        onChangeText={setMonto}
        placeholder="Monto a retirar"
        keyboardType="numeric"
      />
      <Button title="Retirar" onPress={onSubmit} />
      {resultados.length > 0 && (
        <View>
          {resultados.map((resultado, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              {showBilletes(resultado.denominacion)}
              <Text>{`${resultado.billetes}`}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 100,
  },
});

export default App;
