import { StyleSheet } from '@react-pdf/renderer';
 
 export const reportStyles = StyleSheet.create({
   page: {
     padding: 40,
     fontSize: 10,
     fontFamily: 'Helvetica',
   },
   header: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 20,
   },
   logo: {
     width: 60,
     height: 60,
   },
   title: {
     fontSize: 16,
     textAlign: 'center',
     fontWeight: 'bold',
     marginBottom: 10,
     textTransform: 'uppercase',
   },
   description: {
     fontSize: 10,
     marginBottom: 20,
     textAlign: 'justify',
   },
   tableHeader: {
     flexDirection: 'row',
     borderBottomWidth: 1,
     borderBottomColor: '#000',
     backgroundColor: '#e4e4e4',
     padding: 5,
   },
   tableRow: {
     flexDirection: 'row',
     paddingVertical: 4,
     borderBottomWidth: 0.5,
     borderBottomColor: '#ccc',
   },
   cell: {
     flex: 1,
     paddingHorizontal: 4,
   },
 });