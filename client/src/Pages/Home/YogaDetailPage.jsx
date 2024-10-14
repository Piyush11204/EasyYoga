import React from 'react';
import { useParams } from 'react-router-dom';

const yogaData = {
    hatha: {
      name: 'Hatha Yoga',
      description: 'Hatha yoga is a gentle introduction to the most basic yoga postures. Its a great starting point for beginners and focuses on physical postures (asanas) and breathing techniques (pranayama).',
      benefits: [
        'Improves flexibility and joint range of motion',
        'Builds strength and muscle tone',
        'Reduces stress and promotes relaxation',
        'Improves posture and body awareness',
        'Enhances breathing and lung capacity',
        'Balances the nervous system',
      ],
      steps: [
        'Start with a few minutes of gentle breathing to center yourself',
        'Warm up with gentle movements like Cat-Cow pose',
        'Practice standing poses such as Mountain pose and Triangle pose',
        'Move to seated poses like Staff pose and Seated Forward Bend',
        'Include some gentle twists and backbends',
        'Finish with relaxation in Corpse pose (Savasana)',
      ],
      foodRoutine: [
        'Start your day with warm lemon water to aid digestion',
        'Eat a light breakfast of fresh fruits or oatmeal with nuts',
        'Have a balanced lunch with whole grains, legumes, and vegetables',
        'Snack on nuts, seeds, or fresh fruit in the afternoon',
        'End your day with a light dinner, focusing on vegetables and lean proteins',
        'Avoid heavy meals at least 2 hours before practicing yoga',
      ],
    },
    vinyasa: {
      name: 'Vinyasa Flow',
      description: 'Vinyasa yoga is a dynamic practice that links movement and breath to attain balance in the mind and body. From the Sanskrit "to place in a special way," Vinyasa aligns a deliberate sequence of poses with the breath to achieve a continuous flow.',
      benefits: [
        'Improves cardiovascular fitness',
        'Builds core strength and stability',
        'Enhances mind-body connection',
        'Increases flexibility and range of motion',
        'Reduces stress and anxiety',
        'Improves balance and coordination',
      ],
      steps: [
        'Begin with Sun Salutations to warm up the body',
        'Flow through standing poses, linking them with breath',
        'Incorporate balancing poses to challenge stability',
        'Practice arm balances and inversions as you progress',
        'Include seated poses and twists',
        'Cool down with forward bends and hip openers',
        'End with a restful Savasana',
      ],
      foodRoutine: [
        'Hydrate well before and after practice',
        'Eat easily digestible foods like bananas or toast before morning practice',
        'Post-practice, refuel with a protein-rich smoothie',
        'Focus on whole grains, lean proteins, and plenty of vegetables throughout the day',
        'Include healthy fats like avocado and nuts in your diet',
        'Consider light, nutrient-dense snacks between meals',
      ],
    },
    yin: {
      name: 'Yin Yoga',
      description: 'Yin Yoga is a slow-paced style of yoga with postures, or asanas, that are held for longer periods of time. It targets the connective tissues, such as the ligaments, bones, and even the joints of the body that normally are not exercised very much in a more active style of asana practice.',
      benefits: [
        'Increases flexibility, especially around the joints',
        'Reduces stress and anxiety',
        'Balances the mind and body',
        'Releases fascia and improves joint mobility',
        'Encourages mindfulness and meditation',
        'Improves circulation in the joints and tissues',
      ],
      steps: [
        'Begin with a few minutes of centering and breathing',
        'Move into a seated or reclined posture',
        'Hold the pose for 3-5 minutes, or even longer',
        'Focus on breathing and releasing tension',
        'Slowly transition between poses',
        'Include a variety of forward bends, twists, and backbends',
        'End with an extended Savasana',
      ],
      foodRoutine: [
        'Start the day with herbal tea or warm water with lemon',
        'Eat light, easily digestible meals before practice',
        'Focus on hydrating foods like cucumbers and watermelon',
        'Include anti-inflammatory foods like berries and leafy greens',
        'Consider bone broths or collagen-rich foods for joint health',
        'End the day with calming chamomile tea',
      ],
    },
    ashtanga: {
      name: 'Ashtanga Yoga',
      description: 'Ashtanga yoga is a vigorous and orderly style of yoga developed by K. Pattabhi Jois. It involves synchronizing breath with progressive and challenging series of postures, producing intense internal heat and detoxifying sweat that purifies muscles and organs.',
      benefits: [
        'Builds strong, lean muscles',
        'Improves stamina and endurance',
        'Enhances focus and concentration',
        'Detoxifies the body through sweat',
        'Improves flexibility and balance',
        'Calms the mind and reduces stress',
      ],
      steps: [
        'Start with Sun Salutations to warm up',
        'Progress through the standing sequence',
        'Move on to seated poses and inversions',
        'Practice jumping back and jumping through between poses',
        'Include the closing sequence with shoulder stand and headstand',
        'Finish with seated meditation and Savasana',
      ],
      foodRoutine: [
        'Practice on an empty stomach, ideally in the morning',
        'After practice, wait at least 30 minutes before eating',
        'Focus on easily digestible, whole foods',
        'Include plenty of fruits, vegetables, and lean proteins',
        'Stay hydrated with water and coconut water',
        'Consider a plant-based diet to enhance practice',
      ],
    },
    kundalini: {
      name: 'Kundalini Yoga',
      description: 'Kundalini yoga is a form of yoga that involves chanting, singing, breathing exercises, and repetitive poses. Its purpose is to activate your Kundalini energy, or shakti, which is said to be a spiritual energy located at the base of your spine.',
      benefits: [
        'Builds core strength and flexibility',
        'Balances the glandular system',
        'Strengthens the nervous system',
        'Increases lung capacity',
        'Induces mental clarity and calmness',
        'Promotes spiritual growth and awareness',
      ],
      steps: [
        'Begin with tuning in by chanting "Ong Namo Guru Dev Namo"',
        'Practice pranayama (breathing exercises) like Breath of Fire',
        'Perform kriyas (sequence of postures, breath, and sound)',
        'Include mantras and mudras in your practice',
        'Practice meditation and mindfulness',
        'End with relaxation and a closing chant',
      ],
      foodRoutine: [
        'Start the day with a glass of water mixed with lemon and cayenne pepper',
        'Eat light, sattvic foods like fruits, vegetables, and whole grains',
        'Include turmeric and ginger in your diet for their anti-inflammatory properties',
        'Drink yogi tea (a spiced tea blend) to support your practice',
        'Consider intermittent fasting under proper guidance',
        'Avoid alcohol and stimulants',
      ],
    },
    restorative: {
      name: 'Restorative Yoga',
      description: 'Restorative yoga is a passive, cooling style of yoga that involves holding postures for longer periods of time with the help of props. This practice focuses on relaxation and rejuvenation, promoting deep rest and healing.',
      benefits: [
        'Deeply relaxes the body and mind',
        'Reduces stress and anxiety',
        'Improves sleep quality',
        'Enhances mood and well-being',
        'Supports the immune system',
        'Promotes mindfulness and body awareness',
      ],
      steps: [
        'Set up a comfortable, quiet space with necessary props',
        'Begin with gentle breathing exercises',
        'Move into supported poses using bolsters, blankets, and blocks',
        'Hold each pose for 5-10 minutes or longer',
        'Focus on complete relaxation and surrender in each pose',
        'Include gentle twists and inversions',
        'End with an extended Savasana',
      ],
      foodRoutine: [
        'Focus on easily digestible, calming foods',
        'Include warm, nourishing soups and stews',
        'Drink herbal teas like chamomile or lavender',
        'Avoid heavy meals before practice',
        'Include magnesium-rich foods like leafy greens and nuts',
        'Consider tart cherry juice for its natural melatonin content',
      ],
    },
  };
const YogaDetailPage = () => {
  const { id } = useParams();
  const yoga = yogaData[id];

  if (!yoga) {
    return <div>Yoga style not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{yoga.name}</h1>
      <img src="/api/placeholder/800/400" alt={yoga.name} className="w-full h-64 object-cover rounded-lg mb-8" />
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <p>{yoga.description}</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
        <ul className="list-disc pl-6">
          {yoga.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Step-by-Step Guide</h2>
        <ol className="list-decimal pl-6">
          {yoga.steps.map((step, index) => (
            <li key={index} className="mb-2">{step}</li>
          ))}
        </ol>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recommended Food Routine</h2>
        <ul className="list-disc pl-6">
          {yoga.foodRoutine.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default YogaDetailPage;