'''

Andrew Ark
MIT
7/18/2018


'''

import numpy
from keras.models import Sequential
from keras.layers import Activation, Dense, Conv2D, MaxPooling2D, BatchNormalization, Dropout, Flatten
from keras.optimizers import Adam
from keras.preprocessing.image import ImageDataGenerator

alex = Sequential([
	Conv2D(input_shape=(224,224,3), filters=96, kernel_size=11, strides=4, activation='relu'),
	BatchNormalization(),
	MaxPooling2D(pool_size=(3, 3), strides=(2,2)),

	Conv2D(filters=256, kernel_size=5, strides=1, activation = 'relu'),
	BatchNormalization(),
	MaxPooling2D(pool_size=(3, 3), strides=(2,2)),

	Conv2D(filters=384, kernel_size=3, strides=1, activation = 'relu'),
	Conv2D(filters=384, kernel_size=3, strides=1, activation = 'relu'),

	Conv2D(filters=256, kernel_size=3, strides=1, activation='relu'),
	MaxPooling2D(pool_size=(3, 3), strides=(2,2)),
        
    Flatten(),
    Dense(4096, activation='relu'),
	Dropout(0.5),
	Dense(4096, activation='relu'),
	Dropout(0.5),

    Dense(1),
    Activation('sigmoid')
    
	])


custom_adam = Adam(
    lr = 0.0001
)

alex.compile(optimizer=custom_adam,
              loss='binary_crossentropy',
              metrics=['accuracy'])

batch_size = 32

train_datagen = ImageDataGenerator(validation_split = .1, samplewise_center = True)

train_generator = train_datagen.flow_from_directory(
    '/data',  
    target_size=(224, 224),  
    batch_size=batch_size,
    class_mode='binary',
    subset = 'training')  

validation_generator = train_datagen.flow_from_directory(
    '/data',  
    target_size=(224, 224),  
    batch_size=batch_size,
    class_mode='binary',
    subset='validation')  



alex.fit_generator(
        generator = train_generator,
        epochs=10,
        validation_data = validation_generator,
    )

alex.save_weights('first_try.h5')  

alex.fit_generator(
    generator = train_generator,
    epochs=20,
    initial_epoch = 10,
    validation_data = validation_generator,
    )
