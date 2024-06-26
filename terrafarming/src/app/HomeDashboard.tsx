import React, { useState } from 'react'
import { SafeAreaView, Text, TextInput, Button, Image, View, ScrollView, StyleSheet, Dimensions } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import AWS from 'aws-sdk'
import awsconfig from '../../aws-exports'
import { PieChart } from 'react-native-gifted-charts'

// Configurar as credenciais da AWS
AWS.config.update({
  region: awsconfig.region,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsconfig.identityPoolId,
  }),
})

const rekognition = new AWS.Rekognition()

export const HomeDashboard = () => {
  const [image, setImage] = useState<string | null>(null)
  const [ph, setPh] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [temperature, setTemperature] = useState(0)
  const [recommendations, setRecommendations] = useState('')

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri) // Corrigindo acesso ao URI
    }
  }

  const fetchMetrics = async () => {
    // Simulação da obtenção de métricas. Substitua pela chamada real ao seu backend.
    setPh(6.5)
    setHumidity(45)
    setTemperature(22)

    const params = {
      PH: 6.5,
      Humidity: 45,
      Temperature: 22,
    }

    try {
      const response = await fetch(awsconfig.bedrock.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const screenWidth = Dimensions.get('window').width

  const phData = [
    { key: 1, value: 6.5, svg: { fill: '#f39c12' }, arc: {cornerRadius: 25}, recommendation: 'Ajustar para 6.0-7.0 para otimização' },
    { key: 2, value: 45, svg: { fill: '#2ecc71' }, arc: {cornerRadius: 25}, recommendation: 'Ajustar para 50-70% para melhores resultados' },
    { key: 3, value: 25, svg: { fill: '#3498db' }, arc: {cornerRadius: 25}, recommendation: 'Manter entre 20-25°C para crescimento ideal' },
  ]

  const humidityData = [
    { key: 1, value: 6.5, svg: { fill: '#f39c12' }, arc: {cornerRadius: 25}, recommendation: 'Ajustar para 6.0-7.0 para otimização' },
    { key: 2, value: 45, svg: { fill: '#2ecc71' }, arc: {cornerRadius: 25}, recommendation: 'Ajustar para 50-70% para melhores resultados' },
    { key: 3, value: 22, svg: { fill: '#3498db' }, arc: {cornerRadius: 25}, recommendation: 'Manter entre 20-25°C para crescimento ideal' },
  ]

  const temperatureData = [
    { key: 1, value: 6.5, svg: { fill: '#f39c12' }, arc: {cornerRadius: 25}, recommendation: 'Ajustar para 6.0-7.0 para otimização' },
    { key: 2, value: 45, svg: { fill: '#2ecc71' }, arc: {cornerRadius: 25}, recommendation: 'Ajustar para 50-70% para melhores resultados' },
    { key: 3, value: 22, svg: { fill: '#3498db' }, arc: {cornerRadius: 25}, recommendation: 'Manter entre 20-25°C para crescimento ideal' },
  ]

  return (
    <SafeAreaView className="flex-1 p-6">
      <ScrollView>
        <Text className="text-2xl font-bold mb-4">Ultima Verificação de Maturidade das Frutas/Vegetais</Text>
        {/* <Button title="Escolher Imagem" onPress={chooseImage} /> */}
        {image ? (
          <View className="flex-row mt-4 ">
            <Image source={{ uri: image }} className="w-24 h-24 mr-2 rounded-lg" />
            <Image source={{ uri: image }} className="w-24 h-24 mr-2 rounded-lg" />
            <Image source={{ uri: image }} className="w-24 h-24 mr-2 rounded-lg" />
          </View>
        ) : <Text className="text-2xl font-bold mb-4">Sem imagens</Text>}
        
        {/* <Button title="Obter Métricas" onPress={fetchMetrics} /> */}

        <Text className="text-2xl font-bold mb-4">Frutas/Vegetais com possíveis fungos</Text>

        {image ? (
          <View className="flex-row mt-4 ">
            <Image source={{ uri: image }} className="w-24 h-24 mr-2 rounded-lg" />
            <Image source={{ uri: image }} className="w-24 h-24 mr-2 rounded-lg" />
            <Image source={{ uri: image }} className="w-24 h-24 mr-2 rounded-lg" />
          </View>
        ) : <Text className="text-2xl font-bold mb-4">Sem imagens</Text>}

        <Text className="text-lg font-bold mb-2 ">Metricas Gerais</Text>

        <View className="flex-row justify-around mt-4 ">
          <View className="items-center ">
            <Text className="text-lg font-bold mb-2 ">pH</Text>
            <PieChart
              data={phData}
              radius={50}
              innerRadius={30}
              centerLabelComponent={() => <Text>{ph}</Text>}
              donut
            />
          </View>
          <View className="items-center ">
            <Text className="text-lg font-bold mb-2 ">Umidade</Text>
            <PieChart
              data={humidityData}
              radius={50}
              innerRadius={30}
              centerLabelComponent={() => <Text>{humidity}</Text>}
              donut
            />
          </View>
          <View className="items-center ">
            <Text className="text-lg font-bold mb-2">Temperatura</Text>
            <PieChart
              data={temperatureData}
              radius={50}
              innerRadius={30}
              centerLabelComponent={() => <Text>{temperature}</Text>}
              donut
            />
          </View>
        </View>


        {recommendations ? (
          <View style={styles.recommendationsContainer}>
              <View style={styles.recommendationItem}>
                <Text style={styles.metric}>Recomm</Text>
                <Text style={styles.recommendation}>{item.recommendation}</Text>
              </View>
          </View>
        ) : <Text className="text-2xl font-bold mb-4">Sem metrícas</Text>}


      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  recommendationsContainer: {
    paddingHorizontal: 20,
  },
  recommendationItem: {
    marginBottom: 20,
  },
  metric: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recommendation: {
    fontSize: 16,
    color: '#333',
  },
})

// import React, { useState } from 'react'
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   Button,
//   Image,
//   View,
// } from 'react-native'
// import * as ImagePicker from 'expo-image-picker'
// import AWS from 'aws-sdk'
// import awsconfig from '../../aws-exports'

// // Configurar as credenciais da AWS
// AWS.config.update({
//   region: awsconfig.region,
//   credentials: new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: awsconfig.identityPoolId,
//   }),
// })

// const rekognition = new AWS.Rekognition()

// export const HomeDashboard = () => {
//   const [image, setImage] = useState<string | null>(null)
//   const [ph, setPh] = useState('')
//   const [humidity, setHumidity] = useState('')
//   const [temperature, setTemperature] = useState('')

//   const chooseImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     })

//     if (!result.canceled) {
//       setImage(result.assets[0].uri) // Corrigindo acesso ao URI
//     }
//   }

//   const analyzeImage = async () => {
//     if (!image) return

//     const response = await fetch(image)
//     const blob = await response.blob()
//     const arrayBuffer = await blob.arrayBuffer()
//     const buffer = new Uint8Array(arrayBuffer)

//     const params = {
//       Image: {
//         Bytes: buffer,
//       },
//     }

//     rekognition.detectLabels(params, (err, data) => {
//       if (err) console.log(err)
//       else console.log(data)
//     })
//   }

//   const getRecommendations = async () => {
//     const params = {
//       PH: ph,
//       Humidity: humidity,
//       Temperature: temperature,
//     }

//     try {
//       const response = await fetch(awsconfig.bedrock.endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(params),
//       })

//       if (!response.ok) {
//         throw new Error('Network response was not ok')
//       }

//       const data = await response.json()
//       console.log(data)
//     } catch (error) {
//       console.error('Error fetching recommendations:', error)
//     }
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Verificação de Maturidade</Text>
//       <Button title="Escolher Imagem" onPress={chooseImage} />
//       {image && <Image source={{ uri: image }} style={styles.image} />}
//       <Button title="Analisar Imagem" onPress={analyzeImage} />

//       <Text style={styles.title}>Dados do Solo</Text>
//       <TextInput
//         placeholder="pH do Solo"
//         value={ph}
//         onChangeText={setPh}
//         style={styles.input}
//         keyboardType="numeric"
//       />
//       <TextInput
//         placeholder="Umidade do Solo"
//         value={humidity}
//         onChangeText={setHumidity}
//         style={styles.input}
//         keyboardType="numeric"
//       />
//       <TextInput
//         placeholder="Temperatura"
//         value={temperature}
//         onChangeText={setTemperature}
//         style={styles.input}
//         keyboardType="numeric"
//       />
//       <Button title="Obter Recomendações" onPress={getRecommendations} />
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     marginVertical: 10,
//   },
// })